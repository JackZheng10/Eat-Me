import React, { Component } from "react";
import { Platform, View } from "react-native";
import { withNavigation } from "react-navigation";
import Swiper from "react-native-deck-swiper";
import RestaurantCard from "./components/RestaurantCard";
import baseURL from "../../../../../../../baseURL";
import axios from "axios";

class Session extends Component {
  state = {
    restaurants: [],
    currentRestaurant: null,
    restaurantIndex: 0,
    needMoreRestaurants: false,
  };

  componentDidMount = () => {
    this.newStartup();
  };

  //Check Session Status - If started, continue in list from where they left off
  newStartup = async () => {
    const { sessionDetails } = this.props.route.params;
    const sessionRestaurants = await axios.post(
      `${baseURL}/session/getSessionRestaurants`,
      { ID: sessionDetails.ID }
    );

    const { restaurants, restaurantIndex } = sessionRestaurants.data.session;

    this.setState({
      restaurants: restaurants,
      restaurantIndex: restaurantIndex,
      currentRestaurant: restaurants[restaurantIndex],
    });
  };

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

  onSwipedRight = (index) => {};

  onSwipedLeft = (index) => {};

  renderRestaurant = (restaurant, index) => {
    return (
      <RestaurantCard
        restaurant={this.state.currentRestaurant}
        images={this.state.currentRestaurant.images}
      />
    );
  };

  renderSwiper = () => {
    if (
      this.state.restaurants.length > 0 &&
      this.state.currentRestaurant !== null
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

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        {this.renderSwiper()}
      </View>
    );
  }
}

export default withNavigation(Session);
