import React, { Component } from "react";
import { View, StyleSheet, Animated, Text } from "react-native";
import { ListItem as RNEListItem, Icon } from "react-native-elements";

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

  // state = {
  //   rightIcon: this.defaultIcon(),
  //   default: true,
  //   fadeAnim: new Animated.Value(0),
  // };

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
            color="#F79256"
            size={35}
          />
        </Animated.View>
        <Animated.View
          style={{
            flexDirection: "row",
            right: this.state.tappedIconsRight,
          }}
        >
          <Icon
            name="paper-plane"
            type="entypo"
            reverse
            raised
            color="#8ED5F5"
            containerStyle={styles.iconContainerStyle}
            onPress={() => {
              console.log("pressed inv");
            }}
          />
          <Icon
            name="trash-can-outline"
            type="material-community"
            reverse
            raised
            color="#F75555"
            containerStyle={styles.iconContainerStyle}
            onPress={() => {
              console.log("pressed del");
            }}
          />
        </Animated.View>
      </View>
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
