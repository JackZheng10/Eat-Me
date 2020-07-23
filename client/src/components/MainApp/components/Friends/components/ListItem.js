import React, { Component } from "react";
import { View, StyleSheet, Animated, Text, Alert } from "react-native";
import { ListItem as RNEListItem, Icon } from "react-native-elements";
import { getCurrentUser, updateToken } from "../../../../../helpers/session";
import axios from "axios";
import baseURL from "../../../../../../baseURL";

const styles = StyleSheet.create({
  iconContainerStyle: {
    marginTop: -10,
    marginBottom: -10,
  },
});

class ListItem extends Component {
  state = {
    arrowRotate: new Animated.Value(0),
    arrowRight: new Animated.Value(-135),
    tappedIconsRight: new Animated.Value(-150),
    tapped: false,
  };

  renderIcons = (rotation) => {
    return (
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Animated.View
          style={{
            flexDirection: "row",
            right: this.state.arrowRight,
            transform: [{ rotate: rotation }],
          }}
        >
          <Icon
            name="angle-right"
            type="font-awesome"
            color={this.props.friendReqConfig ? "#8ED5F5" : "#F79256"}
            size={35}
          />
        </Animated.View>
        <Animated.View
          style={{
            flexDirection: "row",
            right: this.state.tappedIconsRight,
          }}
        >
          {/*friends list buttons*/}
          {!this.props.friendReqConfig && (
            <Icon
              name="trash-can-outline"
              type="material-community"
              reverse
              raised
              color="#F75555"
              containerStyle={styles.iconContainerStyle}
              onPress={this.handleDeleteFriend}
            />
          )}
          {!this.props.friendReqConfig && (
            <Icon
              name="paper-plane"
              type="entypo"
              reverse
              raised
              color="#8ED5F5"
              containerStyle={styles.iconContainerStyle}
              onPress={() => {
                console.log("pressed invite");
              }}
            />
          )}

          {/*friend requests list buttons*/}
          {this.props.friendReqConfig && (
            <Icon
              name="add"
              type="material"
              reverse
              raised
              color="#F75555"
              containerStyle={styles.iconContainerStyle}
              iconStyle={{ transform: [{ rotate: "45deg" }] }}
              onPress={this.handleDeclineFriend}
            />
          )}
          {this.props.friendReqConfig && (
            <Icon
              name="check"
              type="material"
              reverse
              raised
              color="#55F78B"
              containerStyle={styles.iconContainerStyle}
              onPress={this.handleAcceptFriend}
            />
          )}
        </Animated.View>
      </View>
    );
  };

  handleDeclineFriend = async () => {
    let currentUser = await getCurrentUser();

    try {
      const response = await axios.put(`${baseURL}/user/declineFriend`, {
        phone: currentUser.phone,
        ID: this.props.user.ID,
      });

      alert(response.data.message);
    } catch (error) {
      console.log("Error with declining friend request: ", error);
      alert("Error with declining friend request. Please try again.");
    }
  };

  handleAcceptFriend = async () => {
    let currentUser = await getCurrentUser();

    try {
      const response = await axios.put(`${baseURL}/user/acceptFriend`, {
        phone: currentUser.phone,
        ID: this.props.user.ID,
      });

      alert(response.data.message);
    } catch (error) {
      console.log("Error with accepting friend request: ", error);
      alert("Error with accepting friend request. Please try again.");
    }
  };

  handleDeleteFriend = async () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to remove this friend?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            //todo: maybe move this in another function or keep it in this onpress
            let currentUser = await getCurrentUser();

            try {
              const response = await axios.put(`${baseURL}/user/deleteFriend`, {
                phone: currentUser.phone,
                ID: this.props.user.ID,
              });

              alert(response.data.message);
            } catch (error) {
              console.log("Error with deleting friend: ", error);
              alert("Error with deleting friend. Please try again.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  toggleIcons = () => {
    if (this.state.tapped) {
      Animated.timing(this.state.arrowRotate, {
        toValue: 0,
        duration: 500,
      }).start();

      Animated.timing(this.state.arrowRight, {
        toValue: -135,
        duration: 500,
      }).start();

      Animated.timing(this.state.tappedIconsRight, {
        toValue: -150,
        duration: 500,
      }).start();

      this.setState({
        tapped: false,
      });
    } else {
      Animated.timing(this.state.arrowRotate, {
        toValue: 180,
        duration: 500,
      }).start();

      Animated.timing(this.state.arrowRight, {
        toValue: 0,
        duration: 500,
      }).start();

      Animated.timing(this.state.tappedIconsRight, {
        toValue: -15,
        duration: 500,
      }).start();

      this.setState({
        tapped: true,
      });
    }
  };

  render() {
    const { listItemProps } = this.props;

    let rotation = this.state.arrowRotate.interpolate({
      inputRange: [0, 360],
      outputRange: ["0deg", "360deg"],
    });

    return (
      <RNEListItem
        {...listItemProps}
        rightIcon={this.renderIcons(rotation)}
        onPress={this.toggleIcons}
      />
    );
  }
}

export default ListItem;
