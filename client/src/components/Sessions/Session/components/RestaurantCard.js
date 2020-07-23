import React, { Component } from "react";
import { TouchableWithoutFeedback, StyleSheet } from "react-native";
import { Card } from "react-native-elements";

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
		if (imageIndex < this.props.images.length - 1) {
			imageIndex++;
		} else {
			imageIndex = 0;
		}

		this.setState({ imageIndex });
	};

	//ContentContainerStyle to get appropriate height for box
	render() {
		const currentImage = this.props.images[this.state.imageIndex];
		return (
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
		);
	}
}

export default RestaurantCard;
