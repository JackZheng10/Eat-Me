import React, { Component } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { withNavigation } from "react-navigation";
import ListItem from "./ListItem";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

//cant use nav here
/*
Usage

Props: 
-friendReqConfig (bool): whether or not to use the friend requests configuration for the list (if false, will use the friends one)
*/

const styles = StyleSheet.create({
  friendsContainerStyle: {
    backgroundColor: "#F5F1ED",
  },
  friendReqContainerStyle: {
    backgroundColor: "white",
  },
  friendsTitleStyle: {
    fontWeight: "bold",
    color: "#F79256",
  },
  friendReqTitleStyle: {
    fontWeight: "bold",
    color: "#8ED5F5",
  },
  subtitleStyle: {
    color: "black",
  },
});

class List extends Component {
  renderList = (friendReqConfig) => {
    return this.props.users.map((user, index) => {
      return (
        <ListItem
          listItemProps={{
            title: `${user.fName} ${user.lName}`,
            titleProps: {
              style: friendReqConfig
                ? styles.friendReqTitleStyle
                : styles.friendsTitleStyle,
            },
            subtitle: user.phone,
            subtitleProps: { style: styles.subtitleStyle },
            bottomDivider: true,
            containerStyle: friendReqConfig
              ? styles.friendReqContainerStyle
              : styles.friendsContainerStyle,
          }}
          friendReqConfig={friendReqConfig}
          key={index}
          user={user}
        />
      );
    });
  };

  render() {
    const { friendReqConfig } = this.props;

    return (
      <ScrollView style={{ width: "100%" }}>
        {this.renderList(friendReqConfig)}
        <View style={{ height: friendReqConfig ? 15 : 0 }} />
      </ScrollView>
    );
  }
}

export default List;
