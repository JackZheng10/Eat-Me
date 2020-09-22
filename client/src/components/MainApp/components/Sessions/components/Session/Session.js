import React, { Component } from "react";
import { Platform, View, AppState, StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";
import { Button, Text, Divider } from "react-native-elements";
import Swiper from "react-native-deck-swiper";
import RestaurantCard from "./components/RestaurantCard";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getCurrentUser } from "../../../../../../helpers/session";
import baseURL from "../../../../../../../baseURL";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  memberFinishedContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    marginTop: hp("3%"),
  },
  memberFinishedHeader: {
    fontSize: hp("4.2%"),
    color: "#00B2CA",
    textAlign: "center",
  },
  memberFinishedButton: {
    marginTop: hp("2%"),
    backgroundColor: "#F79256",
    width: wp("75%"),
    borderRadius: 50,
  },
  memberFinishedSelectionContainer: {
    marginTop: hp("5%"),
    alignItems: "center",
  },
  memberFinishedSelectionDivider: {
    backgroundColor: "#F79256",
    width: wp("90%"),
    height: hp("0.2%"),
  },
  memberFinishedSelectionText: {
    marginTop: hp("1%"),
    textAlign: "center",
    fontSize: hp("2.2%"),
    color: "#00B2CA",
  },
});

class Session extends Component {
  state = {
    restaurants: [],
    selectedRestaurants: [],
    currentRestaurant: null,
    restaurantIndex: null,
    needMoreRestaurants: false,
    matchedRestaurantIndex: -1,
    memberFinished: false,
  };

  componentDidMount = () => {
    AppState.addEventListener("change", this._handleAppStateChange);
    this.fetchSessionStats();
  };

  componentWillUnmount = () => {
    //this.updateRestaurantIndex();
    AppState.removeEventListener("change", this._handleAppStateChange);
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (
      this.state.restaurantIndex > prevState.restaurantIndex &&
      prevState.restaurantIndex != null
    ) {
      this.updateRestaurantIndex();
    }
  };

  _handleAppStateChange = async (nextAppState) => {
    //App is paused - Possible Issue too many updates to DB
    if (nextAppState.match(/inactive|background/))
      await this.updateRestaurantIndex();
  };

  fetchSessionStats = async () => {
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

    const memberFinished = member.currentRestaurantIndex >= restaurants.length;

    this.setState({
      restaurants,
      restaurantIndex: member.currentRestaurantIndex,
      currentRestaurant: restaurants[member.currentRestaurantIndex],
      selectedRestaurants: [...member.selectedRestaurants],
      memberFinished,
      matchedRestaurantIndex,
    });
  };

  renderSessionView = () => {
    const {
      currentRestaurant,
      matchedRestaurantIndex,
      memberFinished,
    } = this.state;

    if (
      currentRestaurant !== null &&
      matchedRestaurantIndex == -1 &&
      !memberFinished
    ) {
      return this.renderSwiper();
    } else if (matchedRestaurantIndex == -1 && memberFinished) {
      return this.renderMemberFinished();
    } else if (matchedRestaurantIndex !== -1) {
      return this.renderMatchedRestaurant();
    } else {
      //Return Loading Spinner or such
    }
  };

  renderSwiper = () => {
    const { restaurants, restaurantIndex } = this.state;

    //Update Swiper View
    return (
      <Swiper
        useViewOverflow={Platform.OS === "ios"}
        cards={restaurants}
        renderCard={this.renderRestaurant}
        verticalSwipe={false}
        onSwiped={this.onSwiped}
        onSwipedRight={this.onSwipedRight}
        onSwipedLeft={this.onSwipedLeft}
        cardIndex={restaurantIndex}
        backgroundColor="#F5F1ED"
      />
    );
  };

  updateRestaurantIndex = async () => {
    const { sessionDetails } = this.props.route.params;
    const currentUser = await getCurrentUser();

    const updateRestaurantIndexResponse = await axios.post(
      `${baseURL}/session/updateSessionMemberRestaurantIndex`,
      {
        currentRestaurantIndex: this.state.restaurantIndex,
        sessionID: sessionDetails.ID,
        userID: currentUser.ID,
      }
    );

    //Check for error with response
    if (!updateRestaurantIndexResponse.data.success) {
      //Failure scenario - what to do? Store index in local storage
    }
  };

  renderRestaurant = (restaurant, index) => {
    return <RestaurantCard restaurant={this.state.currentRestaurant} />;
  };

  onSwiped = (index) => {
    //If less than 3 restaraunts left fetch more. Relook into this idea for all sessions
    const needMoreRestaurants =
      this.state.restaurants.length - this.state.restaurantIndex < 3;

    this.setState({
      currentRestaurant: this.state.restaurants[index + 1],
      restaurantIndex: index + 1,
      needMoreRestaurants,
      memberFinished: index + 1 >= this.state.restaurants.length,
    });
  };

  onSwipedRight = async (index) => {
    //Good Swipe - Update DB with Vote and Maybe something with UI but that's probably done outside of this method
    const { sessionDetails } = this.props.route.params;

    const currentUser = await getCurrentUser();

    const vote = await axios.post(`${baseURL}/session/addVoteToSession`, {
      sessionID: sessionDetails.ID,
      restaurantIndex: index,
      userID: currentUser.ID,
    });

    if (vote.data.success) {
      const { matchedRestaurantIndex } = vote.data;
      this.setState({
        selectedRestaurants: [...this.state.selectedRestaurants, index],
        matchedRestaurantIndex,
      });
    } else {
      //Maybe Retry
      console.log("Error trying to add vote: " + vote.data.error);
      alert("Error trying to add vote");
    }
  };

  onSwipedLeft = (index) => {
    //Maybe need it to show whether or not user like/disliked restaurant
  };

  //View shown to user when no matches are made and list is completed. UPDATE! Rethink responsiveness and style
  renderMemberFinished = () => {
    return (
      <View style={styles.memberFinishedContainer}>
        <Text style={styles.memberFinishedHeader}>
          That's all the restaraunts we have for you!
        </Text>

        <Button
          buttonStyle={styles.memberFinishedButton}
          title="Wait for your friends to start matching with your choices!"
          onPress={this.renderSessionsView}
        />

        <View style={styles.memberFinishedSelectionContainer}>
          <Divider style={styles.memberFinishedSelectionDivider} />
          <Text style={styles.memberFinishedSelectionText}>Your Choices:</Text>
          <FlatList
            horizontal={true}
            data={this.getSelectedRestaurantsIndex()}
            renderItem={this.renderSelectedRestaurant}
            keyExtractor={(item) => item.ID}
          />
        </View>
      </View>
    );
  };

  renderSessionsView = () => {
    this.props.navigation.pop();
  };

  getSelectedRestaurantsIndex = () => {
    return this.state.selectedRestaurants.map((selectedRestaruantIndex) => {
      return this.state.restaurants[selectedRestaruantIndex];
    });
  };

  renderSelectedRestaurant = (selectedRestaurant) => {
    return (
      <RestaurantCard restaurant={selectedRestaurant.item} match={false} />
    );
  };

  //Update Matched View
  renderMatchedRestaurant = () => {
    const { restaurants, matchedRestaurantIndex } = this.state;
    //View which shows restaurant Details
    return (
      <View>
        <RestaurantCard
          restaurant={restaurants[matchedRestaurantIndex]}
          match={true}
        />
      </View>
    );
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        {this.renderSessionView()}
      </View>
    );
  }
}

//Update render methods to render correct view based on boolean values
export default withNavigation(Session);
