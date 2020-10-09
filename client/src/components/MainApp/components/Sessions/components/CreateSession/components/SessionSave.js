import React, { Component } from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";
import MapView, { Marker } from "react-native-maps";
import { ModalStyles, SessionSaveStyles as styles } from "./styles";
import CreateSessionHeader from "./CreateSessionHeader";
import CreateSessionFooter from "./CreateSessionFooter";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

class SessionSave extends Component {
  state = {};

  componentDidMount = () => {};

  renderSessionFriendsList = () => {
    const friendsList = this.props.sessionConfigurables.sessionFriends;
    const friendsListNames = friendsList.map((friend) => {
      return friend.fName + " " + friend.lName;
    });

    const friendsListText = this.combineSelectionsWithConjuctions(
      friendsListNames,
      "and"
    );

    return this.renderSectionHeaderAndText("with", friendsListText);
  };

  renderSessionLocation = () => {
    const { sessionLocation } = this.props.sessionConfigurables;

    return this.renderSectionHeaderAndText("around", sessionLocation.address);
  };

  renderSessionCategories = () => {
    const categories = this.props.sessionConfigurables.sessionCategories;

    const selectedCategoriesNames = categories.map((category) => {
      return category.name;
    });

    const selectedCategoriesText = this.combineSelectionsWithConjuctions(
      selectedCategoriesNames,
      "or"
    );

    return this.renderSectionHeaderAndText(
      "You're looking for",
      selectedCategoriesText
    );
  };

  renderSectionHeaderAndText = (header, text) => {
    return (
      <>
        <Text style={styles.sectionHeader} h3>
          {header}
        </Text>

        <Text h4 style={{ textAlign: "center" }}>
          {text}
        </Text>
      </>
    );
  };

  combineSelectionsWithConjuctions = (selections, conjuction) => {
    let selectionsCombinedText = "";

    selections.forEach((selection, index) => {
      if (index == 0) selectionsCombinedText += selection;
      else if (index == 1 && selections.length == 2)
        selectionsCombinedText += ` ${conjuction} ${selection}`;
      else if (index == selections.length - 1)
        selectionsCombinedText += `, ${conjuction} ${selection}`;
      else selectionsCombinedText += `, ${selection}`;
    });

    return selectionsCombinedText;
  };

  renderMap = () => {
    const {
      latitude,
      longitude,
    } = this.props.sessionConfigurables.sessionLocation;

    //Need to play around with the delta values
    return (
      <MapView
        provider="google"
        style={styles.sessionReviewMap}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.0,
        }}
      >
        <Marker
          coordinate={{
            latitude,
            longitude,
          }}
        />
      </MapView>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <CreateSessionHeader
          title="Session Details"
          goBack={this.props.goBack}
          exit={this.props.exit}
        />

        <View style={ModalStyles.content}>
          <View
            style={{
              marginTop: hp("2.5%"),
            }}
          >
            {this.renderSessionCategories()}

            {this.renderSessionLocation()}

            {this.renderSessionFriendsList()}
          </View>

          <View
            style={{
              marginTop: hp("2.5%"),
              alignItems: "center",
            }}
          >
            {this.renderMap()}
          </View>
        </View>

        <CreateSessionFooter
          title="Create Session"
          updateSession={this.props.createSession}
        />
      </View>
    );
  }
}

export default SessionSave;
