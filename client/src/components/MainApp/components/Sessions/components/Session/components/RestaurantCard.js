import React, { Component } from "react";
import {
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Image,
} from "react-native";
import { Card, Text } from "react-native-elements";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const styles = StyleSheet.create({
  restaurantCard: {
    alignItems: "center",
    paddingBottom: 20,
    backgroundColor: "#fcfbfa",
  },
});

class RestaurantCard extends Component {
  state = {
    imageIndex: 0,
  };

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

  //ContentContainerStyle to get appropriate height for box
  render() {
    const currentImage = this.props.restaurant.images[this.state.imageIndex];
    const adjustedWidth = wp(this.props.widthPercentageOfImage);
    let adjustedHeight = 300;

    Image.getSize(currentImage, (imageWidth, imageHeight) => {
      const ratioFactor = adjustedWidth / imageWidth;
      adjustedHeight =
        ratioFactor >= 1
          ? imageHeight / ratioFactor
          : imageHeight * ratioFactor;
    });
    return (
      <View>
        <TouchableWithoutFeedback onPress={(event) => this.onPress(event)}>
          <Card
            title={this.props.restaurant.name}
            containerStyle={styles.restaurantCard}
            image={{
              uri: currentImage,
            }}
            imageStyle={{
              width: adjustedWidth,
              height: adjustedHeight,
            }}
          ></Card>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default RestaurantCard;
