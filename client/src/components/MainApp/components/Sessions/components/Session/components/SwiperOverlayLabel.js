import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";

const styles = StyleSheet.create({
  swiperOverlayTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
  },
  swiperOverlayText: {
    fontSize: 25,
    fontFamily: "Avenir",
    textAlign: "center",
  },
});

class SwiperOverlayLabel extends Component {
  render() {
    return (
      <View
        style={[
          {
            borderColor: this.props.color,
          },
          styles.swiperOverlayTextContainer,
        ]}
      >
        <Text style={[{ color: this.props.color }, styles.swiperOverlayText]}>
          {this.props.labelText}
        </Text>
      </View>
    );
  }
}
export default SwiperOverlayLabel;
