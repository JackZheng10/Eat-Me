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
//might have to move listitem into its own component since the actions need to be separate

const list = [
  {
    name: "Amy Farha",
    avatar_url:
      "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
    subtitle: "4332343246",
  },
  {
    name: "Chris Jackson",
    avatar_url:
      "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
    subtitle: "4332343246",
  },
  {
    name: "Chris Jackson",
    avatar_url:
      "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
    subtitle: "4332343246",
  },
  {
    name: "Chris Jackson",
    avatar_url:
      "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
    subtitle: "4332343246",
  },
  {
    name: "Chris Jackson",
    avatar_url:
      "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
    subtitle: "4332343246",
  },
  {
    name: "Chris Jackson",
    avatar_url:
      "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
    subtitle: "4332343246",
  },
  {
    name: "Chris Jackson",
    avatar_url:
      "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
    subtitle: "4332343246",
  },
  {
    name: "Chris Jackson",
    avatar_url:
      "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
    subtitle: "4332343246",
  },
  {
    name: "Chris Jackson",
    avatar_url:
      "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
    subtitle: "4332343246",
  },
];

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: "#F5F1ED",
  },
  titleStyle: {
    fontWeight: "bold",
    color: "#F79256",
  },
  subtitleStyle: {
    color: "black",
  },
});

class FriendsList extends Component {
  renderList = () => {
    return list.map((item, index) => {
      return (
        <ListItem
          listItemProps={{
            title: item.name,
            titleProps: { style: styles.titleStyle },
            subtitle: item.subtitle,
            subtitleProps: { style: styles.subtitleStyle },
            bottomDivider: true,
            containerStyle: styles.containerStyle,
          }}
          key={index}
        />
      );
    });
  };

  render() {
    return (
      <ScrollView style={{ width: windowWidth }}>
        {this.renderList()}
      </ScrollView>
    );
  }
}

export default FriendsList;
