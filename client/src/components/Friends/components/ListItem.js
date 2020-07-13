import React, { Component } from "react";
import { View, StyleSheet, Animated, Text } from "react-native";
import { ListItem as RNEListItem, Icon } from "react-native-elements";

const styles = StyleSheet.create({
  iconContainerStyle: {
    marginTop: -10,
    marginBottom: -10,
  },
  fadingContainer: {},
});

class ListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tappedIconsOpacity: new Animated.Value(0),
      tappedIconsDisplay: "none",
      defaultIconOpacity: new Animated.Value(1),
      defaultIconDisplay: "flex",
      defaultIconRotate: new Animated.Value(0),
      defaultIconRight: new Animated.Value(5),
    };
  }

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
            opacity: this.state.defaultIconOpacity,
            display: this.state.defaultIconDisplay,
            right: this.state.defaultIconRight,
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
            opacity: this.state.tappedIconsOpacity,
            display: this.state.tappedIconsDisplay,
            flexDirection: "row",
          }}
        >
          <Icon
            name="paper-plane"
            type="entypo"
            reverse
            color="#F79256"
            containerStyle={styles.iconContainerStyle}
          />
          <Icon
            name="trash-can-outline"
            type="material-community"
            reverse
            color="#F75555"
            containerStyle={styles.iconContainerStyle}
          />
        </Animated.View>
      </View>
    );
  };

  toggleIcons = () => {
    this.setState({ tappedIconsDisplay: "flex" }, () => {
      Animated.timing(this.state.defaultIconRotate, {
        toValue: 0.5,
        duration: 500,
      }).start();

      Animated.timing(this.state.defaultIconRight, {
        toValue: 10,
        duration: 1000,
      }).start();

      Animated.timing(this.state.tappedIconsOpacity, {
        toValue: 1,
        duration: 1000,
      }).start();
    });
  };

  render() {
    let rotation = this.state.defaultIconRotate.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    const { listItemProps } = this.props;

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
