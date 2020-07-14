import React, { Component } from "react";
import { Image, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { Content, Text, Card, CardItem } from "native-base";

const styles = StyleSheet.create({
	restaurantCard: {
		alignItems: "center",
		paddingBottom: 20,
	},
	restaurantImage: {
		width: 300,
		height: 300,
	},
});

class RestaurantCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentImage: this.props.images[0],
			imageIndex: 0,
		};
	}

	onPress = (event) => {
		let imageIndex = this.state.imageIndex;
		if (imageIndex < this.props.images.length - 1) {
			imageIndex++;
		} else {
			imageIndex = 0;
		}

		this.setState({
			currentImage: this.props.images[imageIndex],
			imageIndex,
		});
	};

	//ContentContainerStyle to get appropriate height for box
	render() {
		return (
			<TouchableWithoutFeedback onPress={(event) => this.onPress(event)}>
				<Card style={styles.restaurantCard}>
					<CardItem header>
						<Text>{this.props.restaurant.name}</Text>
					</CardItem>
					<CardItem cardBody>
						<Image
							style={styles.restaurantImage}
							source={{
								uri: this.state.currentImage,
							}}
						/>
					</CardItem>
				</Card>
			</TouchableWithoutFeedback>
		);
	}
}

export default RestaurantCard;
