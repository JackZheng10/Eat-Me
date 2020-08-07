import React, { Component } from "react";
import { TouchableWithoutFeedback, StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-elements";

const styles = StyleSheet.create({
  restaurantCard: {
    alignItems: "center",
    paddingBottom: 20,
    backgroundColor: "#fcfbfa",
  },
  restaurantImage: {
    width: 300,
    height: 300,
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

  renderRestaruantDetails = () => {
    const { restaurant } = this.props;

    if (this.props.match) {
      return (
        <Card>
          <Text>Rating: {restaurant.rating}</Text>
          <Text>Options: {restaurant.transactions.toString()}</Text>
          <Text>URL: {restaurant.url}</Text>
        </Card>
      );
    }
  };

  //ContentContainerStyle to get appropriate height for box
  render() {
    const currentImage = this.props.restaurant.images[this.state.imageIndex];
    return (
      <View>
        <TouchableWithoutFeedback onPress={(event) => this.onPress(event)}>
          <Card
            title={this.props.restaurant.name}
            containerStyle={styles.restaurantCard}
            image={{
              uri: currentImage,
            }}
            imageStyle={styles.restaurantImage}
          ></Card>
        </TouchableWithoutFeedback>
        {this.renderRestaruantDetails()}
      </View>
    );
  }
}

export default RestaurantCard;
