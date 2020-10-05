import React, { Component } from "react";
import { Platform, View, AppState, Linking } from "react-native";
import { withNavigation } from "react-navigation";
import { Button, Text, Divider, Card, Icon } from "react-native-elements";
import Swiper from "react-native-deck-swiper";
import RestaurantCard from "./components/RestaurantCard";
import SwiperOverlayLabel from "./components/SwiperOverlayLabel";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getCurrentUser } from "../../../../../../helpers/session";
import baseURL from "../../../../../../../baseURL";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";
import WebModal from "../../../../../utility/WebModal";
import { SessionStyles as styles } from "./styles";

class Session extends Component {
  state = {
    restaurants: [],
    selectedRestaurants: [],
    currentRestaurant: null,
    restaurantIndex: null,
    needMoreRestaurants: false,
    matchedRestaurantIndex: -1,
    memberFinished: false,
    webModal: false,
  };

  componentDidMount = () => {
    AppState.addEventListener("change", this._handleAppStateChange);
    this.fetchSessionStats();
  };

  componentWillUnmount = () => {
    //Maybe store restaurantIndex in async storage just in case;
    AppState.removeEventListener("change", this._handleAppStateChange);

    const { restaurantIndex, restaurants } = this.state;

    //Use Constants instead
    let updatedSessionStatus;

    if (restaurantIndex == 0) updatedSessionStatus = "No Progress";
    else if (restaurantIndex > 0 && restaurantIndex < restaurants.length)
      updatedSessionStatus = "Started";
    else updatedSessionStatus = "Waiting for Friends";

    this.props.route.params.updateSessionStatus(
      this.props.route.params.sessionDetails.ID,
      updatedSessionStatus
    );
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (
      this.state.restaurantIndex > prevState.restaurantIndex &&
      prevState.restaurantIndex != null
    ) {
      this.updateRestaurantIndex();
    }
  };

  //Maybe just store index change in Async storage instead. Too many calls to Server
  _handleAppStateChange = async (nextAppState) => {
    //App is paused - Possible Issue too many updates to DB
    if (nextAppState.match(/inactive|background/)) {
      //await this.updateRestaurantIndex();
    }
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
      return this.renderSearchRestaurants();
    } else if (matchedRestaurantIndex == -1 && memberFinished) {
      return this.renderMemberFinished();
    } else if (matchedRestaurantIndex !== -1) {
      return this.renderMatchedRestaurant();
    } else {
      //Return Loading Spinner or such
    }
  };

  renderSearchRestaurants = () => {
    const { restaurants, restaurantIndex } = this.state;

    //Don't why I need width specified for View containing the Swiper component
    return (
      <View style={styles.searchRestaurantsContainer}>
        <View style={styles.searchRestaurantsSwiperSection}>
          <Swiper
            ref={(swiper) => {
              this.swiper = swiper;
            }}
            cardVerticalMargin={hp("2%")}
            useViewOverflow={Platform.OS === "ios"}
            cards={restaurants}
            renderCard={this.renderRestaurant}
            showSecondCard={true}
            verticalSwipe={false}
            onSwiped={this.onSwiped}
            onSwipedRight={this.onSwipedRight}
            onSwipedLeft={this.onSwipedLeft}
            cardIndex={restaurantIndex}
            backgroundColor="#F5F1ED"
            animateOverlayLabelsOpacity
            overlayOpacityHorizontalThreshold={wp("100%") / 15}
            inputOverlayLabelsOpacityRangeX={[
              -wp("100%") / 3,
              -wp("100%") / 15,
              0,
              wp("100%") / 15,
              wp("100%") / 3,
            ]}
            overlayLabels={{
              left: {
                title: "NOPE",
                element: (
                  <SwiperOverlayLabel labelText={"NOPE"} color={"#E5566D"} />
                ),
                style: {
                  wrapper: {
                    ...styles.searchRestaurantsOverlayWrapper,
                    alignItems: "flex-end",
                    marginLeft: -30,
                  },
                },
              },
              right: {
                title: "LIKE",
                element: (
                  <SwiperOverlayLabel labelText={"LIKE"} color={"#4CCC93"} />
                ),
                style: {
                  wrapper: {
                    ...styles.searchRestaurantsOverlayWrapper,
                    alignItems: "flex-start",
                    marginLeft: 30,
                  },
                },
              },
            }}
          />
        </View>
        <View style={styles.searchRestaurantsBottomSection}>
          <View style={styles.searchRestaurantsIconContainer}>
            <Icon
              type="font-awesome-5"
              name="times"
              color="red"
              raised
              size={hp("4%")}
              onPress={() => this.swiper.swipeLeft()}
            />
            <Icon
              type="font-awesome"
              name="heart"
              color="limegreen"
              raised
              size={hp("4%")}
              onPress={() => this.swiper.swipeRight()}
            />
          </View>
        </View>
      </View>
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
    return (
      <View style={{ alignItems: "center" }}>
        <RestaurantCard
          restaurant={this.state.currentRestaurant}
          widthPercentage={"98%"}
          heightPercentage={"60%"}
          displayOverlayText
        />
      </View>
    );
  };

  onSwiped = (index) => {
    //Don't know if needMoreRestaurants is neccessary anymore
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
    //Think about height percentage of Card. IDK why I need to specify that
    return (
      <Card
        title={selectedRestaurant.item.name}
        containerStyle={{ height: hp("45%") }}
      >
        <RestaurantCard
          restaurant={selectedRestaurant.item}
          widthPercentage={"65%"}
          heightPercentage={"35%"}
        />
      </Card>
    );
  };

  renderMatchedRestaurant = () => {
    const { restaurants, matchedRestaurantIndex } = this.state;
    const matchedRestaurant = restaurants[matchedRestaurantIndex];

    //View which shows restaurant Details
    return (
      <View style={styles.matchedContainer}>
        <Text style={styles.matchedHeader}>We decided!</Text>
        <RestaurantCard
          restaurant={matchedRestaurant}
          widthPercentage={"95%"}
          heightPercentage={"40%"}
          displayOverlayText
        />

        <View style={styles.matchedRestaurantDetailsButtonContainer}>
          <Button
            onPress={this.toggleWebModal}
            title={`Visit Yelp page`}
            buttonStyle={styles.matchedRestaurantDetailsButton}
          />
          <Button
            title={`Call ${matchedRestaurant.name}`}
            onPress={() => Linking.openURL(`tel:${matchedRestaurant.phone}`)}
            buttonStyle={styles.matchedRestaurantDetailsButton}
          />
        </View>

        <WebModal
          visible={this.state.webModal}
          title={matchedRestaurant.name}
          url={matchedRestaurant.url[0]}
          exit={this.toggleWebModal}
        />
      </View>
    );
  };

  toggleWebModal = () => {
    this.setState({
      webModal: !this.state.webModal,
    });
  };

  render() {
    return <React.Fragment>{this.renderSessionView()}</React.Fragment>;
  }
}

//Update render methods to render correct view based on boolean values
export default withNavigation(Session);
