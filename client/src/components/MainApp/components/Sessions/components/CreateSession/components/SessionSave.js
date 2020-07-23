import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Header, Icon, Button, Text, Divider } from "react-native-elements";
import ModalStyles from "../styles/ModalStyles";

const styles = StyleSheet.create({
  sectionHeader: {
    color: "#F79256",
  },
});

class SessionSave extends Component {
  state = {};

  componentDidMount = () => {};

  renderSessionSaveLeft = () => {
    return <Icon onPress={this.props.goBack} name="arrow-back" color="#FFF" />;
  };

  renderSessionSaveRight = () => {
    //Consider Screen sizes for these elements
    return <Icon name="clear" onPress={this.props.exit} color="#FFF" />;
  };

  renderSessionFriendsList = () => {
    const friendsList = this.props.sessionConfigurables.sessionFriends;
    const friendsListText = friendsList.reduce((friendText, friend) => {
      return {
        names:
          friendText.fName +
          " " +
          friendText.lName +
          ", " +
          friend.fName +
          " " +
          friend.lName,
      };
    });

    return (
      <>
        <Text style={styles.sectionHeader} h3>
          Selected Friends:
        </Text>
        <Text h4>
          {friendsList.length > 0
            ? friendsListText.names
            : `${friendsListText.fName} ${friendsListText.lName}`}
        </Text>
      </>
    );
  };

  renderSessionLocation = () => {
    //Get name here possibly, maybe add it to Create Session state SessionConfigurables
    const { sessionLocation } = this.props.sessionConfigurables;

    //Change later
    const addressName =
      sessionLocation.latitude + ", " + sessionLocation.longitude;
    return (
      <>
        <Text style={styles.sectionHeader} h3>
          Selected Location:
        </Text>
        <Text h4>{addressName}</Text>
      </>
    );
  };

  renderSessionCategories = () => {
    const categories = this.props.sessionConfigurables.sessionCategories;
    const selectedCategoriesText = categories.reduce(
      (categoryText, category) => {
        return categoryText + `, ${category}`;
      }
    );

    return (
      <>
        <Text style={styles.sectionHeader} h3>
          Selected Categories:
        </Text>
        <Text h4>{selectedCategoriesText}</Text>
      </>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Header
            containerStyle={{ backgroundColor: "#00B2CA" }}
            leftComponent={this.renderSessionSaveLeft}
            centerComponent={{
              text: "Session Details",
              style: ModalStyles.headerCenterText,
            }}
            rightComponent={this.renderSessionSaveRight}
          />
        </View>
        <View style={ModalStyles.content}>
          <View style={{ flex: 1, justifyContent: "space-around" }}>
            <View style={{ flex: 1, margin: 10 }}>
              {this.renderSessionCategories()}
            </View>

            <View style={{ flex: 1, margin: 10 }}>
              {this.renderSessionLocation()}
            </View>

            <View style={{ flex: 1, margin: 10 }}>
              {this.renderSessionFriendsList()}
            </View>
          </View>
        </View>
        <View style={ModalStyles.footer}>
          <Button
            onPress={this.props.createSession}
            buttonStyle={ModalStyles.updateSessionButton}
            title="Create Session"
          />
        </View>
      </View>
    );
  }
}

export default SessionSave;
