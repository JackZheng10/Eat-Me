import React, { Component } from "react";
import {
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  ImageBackground,
} from "react-native";
import { Text } from "react-native-elements";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const styles = StyleSheet.create({
  overlayTextContainer: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    bottom: 0,
    left: 0,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
  },
  overlayText: {
    fontWeight: "bold",
    color: "white",
    fontSize: hp("2%"),
    margin: 10,
  },
});

class RestaurantCard extends Component {
  state = {
    imageIndex: 0,
    adjustedWidth: wp(this.props.widthPercentage),
    adjustedHeight: hp(this.props.heightPercentage),
  };

  componentDidMount = () => {};

  //Maybe have a left-right tap through of images
  onPress = (event) => {
    let imageIndex = this.state.imageIndex;
    if (imageIndex < this.props.restaurant.images.length - 1) {
      imageIndex++;
    } else {
      imageIndex = 0;
    }

    this.setState({ imageIndex });
  };

  renderOverlayLabel = () => {
    if (this.props.displayOverlayText) {
      return (
        <View style={styles.overlayTextContainer}>
          <Text style={styles.overlayText}>{this.props.restaurant.name}</Text>
        </View>
      );
    }
  };

  render() {
    const currentImage = this.props.restaurant.images[this.state.imageIndex];

    return (
      <TouchableWithoutFeedback onPress={(event) => this.onPress(event)}>
        <View>
          <ImageBackground
            imageStyle={{ borderRadius: 10 }}
            source={{ uri: currentImage }}
            style={{
              width: this.state.adjustedWidth,
              height: this.state.adjustedHeight,
            }}
          >
            {this.renderOverlayLabel()}
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
export default RestaurantCard;
