import React, { Component } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { ListItem } from "react-native-elements";
import { withNavigation } from "react-navigation";

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
});

class FriendsList extends Component {
  renderList = () => {
    return list.map((item, index) => {
      return (
        <ListItem
          key={index}
          rightIcon={{
            type: "font-awesome",
            name: "angle-right",
            color: "#F79256",
            size: 35,
          }}
          title={item.name}
          titleProps={{ style: { fontWeight: "bold" } }}
          subtitle={item.subtitle}
          bottomDivider
          containerStyle={styles.containerStyle}
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
