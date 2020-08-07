import React, { Component } from "react";
import { Platform, View } from "react-native";
import { withNavigation } from "react-navigation";
import { Text } from "react-native-elements";
import Swiper from "react-native-deck-swiper";
import RestaurantCard from "./components/RestaurantCard";
import { getCurrentUser } from "../../../../../../helpers/session";
import baseURL from "../../../../../../../baseURL";
import axios from "axios";

class Session extends Component {
  state = {
    restaurants: [],
    currentRestaurant: null,
    restaurantIndex: 0,
    needMoreRestaurants: false,
    matchedRestaurantIndex: -1,
  };

  componentDidMount = () => {
    this.newStartup();
  };

  newStartup = async () => {
    const currentUser = await getCurrentUser();
    const { sessionDetails } = this.props.route.params;

    const sessionRestaurants = await axios.post(
      `${baseURL}/session/getSessionRestaurants`,
      { sessionID: sessionDetails.ID, userID: currentUser.ID }
    );

    const {
      restaurants,
      member,
      matchedRestaurantIndex,
    } = sessionRestaurants.data;

    this.setState({
      restaurants,
      restaurantIndex: member.currentRestaurantIndex,
      currentRestaurant: restaurants[member.currentRestaurantIndex],
      matchedRestaurantIndex,
    });
  };

  componentWillUnmount() {
    console.log("Unmounting Session");
  }

  componentDidUpdate = () => {
    /*
	  if (this.state.needMoreRestaurants) {
      //this.fetchRestaurants();
  	}
	  */
  };

  fetchRestaurants = async () => {
    //Try to fetch more restaurants if possible, If not then give the user options
  };

  onSwiped = (index) => {
    //If less than 3 restaraunts left fetch more
    const needMoreRestaurants =
      this.state.restaurants.length - this.state.restaurantIndex < 3;

    this.setState({
      currentRestaurant: this.state.restaurants[index + 1],
      restaurantIndex: index + 1,
      needMoreRestaurants,
    });
  };

  onSwipedRight = async (index) => {
    //Good Swipe - Update DB with Vote and Maybe something with UI but that's probably done outside of this method
    const { sessionDetails } = this.props.route.params;

    const vote = await axios.post(`${baseURL}/session/addVoteToSession`, {
      sessionID: sessionDetails.ID,
      restaurantIndex: index,
    });

    if (vote.data.success) {
      const { matchedRestaurantIndex } = vote.data;
      if (matchedRestaurantIndex != -1) {
        this.setState({ matchedRestaurantIndex });
      }
    } else {
      //Maybe Retry
      console.log("Error trying to add vote: " + vote.data.error);
      alert("Error trying to add vote");
    }
  };

  onSwipedLeft = (index) => {};

  renderRestaurant = (restaurant, index) => {
    return <RestaurantCard restaurant={this.state.currentRestaurant} />;
  };

  renderSwiper = () => {
    if (
      this.state.restaurants.length > 0 &&
      this.state.currentRestaurant !== null &&
      this.state.matchedRestaurantIndex == -1
    ) {
      return (
        <Swiper
          useViewOverflow={Platform.OS === "ios"}
          cards={this.state.restaurants}
          renderCard={this.renderRestaurant}
          verticalSwipe={false}
          onSwiped={this.onSwiped}
          onSwipedRight={this.onSwipedRight}
          onSwipedLeft={this.onSwipedLeft}
          cardIndex={this.state.restaurantIndex}
          backgroundColor="#F5F1ED"
        />
      );
    }
  };

  renderMatchedRestaurant = () => {
    const { matchedRestaurantIndex } = this.state;
    if (this.state.matchedRestaurantIndex !== -1) {
      //View which shows restaurant Details
      const { restaurants } = this.state;
      return (
        <View>
          <RestaurantCard
            restaurant={restaurants[matchedRestaurantIndex]}
            match={true}
          />
        </View>
      );
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        {this.renderSwiper()}
        {this.renderMatchedRestaurant()}
      </View>
    );
  }
}

export default withNavigation(Session);
