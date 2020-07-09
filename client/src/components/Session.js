import React, { Component } from "react";
import { Content } from "native-base";
import { Row, Grid } from "react-native-easy-grid";
import Swiper from "react-native-deck-swiper";
import RestaurantCard from "./RestaurantCard";
import baseURL from "../../baseURL";
import axios from "axios";

class Session extends Component {
	state = {
		bareRestaurants: [],
		restaurants: [],
		currentRestaurant: null,
		restaurantIndex: 0,
		currentImageIndex: 0,
		needMoreRestaurants: false,
		fetchIndex: 0,
	};

	componentDidMount = () => {
		this.practiceStartup();
	};

	practiceStartup = async () => {
		const sessionRestaurants = await axios.post(
			`${baseURL}/yelp/session-restaurants`,
			{ SessionID: "ID" }
		);

		const firstRestaurant = await axios.post(`${baseURL}/yelp/restaurant`, {
			restaurantID: sessionRestaurants.data.businesses[0].id,
		});

		let restaurants = [...sessionRestaurants.data.businesses];
		restaurants[0] = firstRestaurant.data;

		this.setState({
			bareRestaurants: [...sessionRestaurants.data.businesses],
			restaurants,
			currentRestaurant: firstRestaurant.data,
			fetchIndex: 1,
			needMoreRestaurants: true,
		});
	};

	componentDidUpdate = () => {
		if (this.state.needMoreRestaurants) {
			this.fetchRestaurants();
		}
	};

	fetchRestaurants = async () => {
		let fetchIndex;
		let newRestaurants = [...this.state.restaurants];

		//Get 5 new Restaurants
		for (
			fetchIndex = this.state.fetchIndex;
			fetchIndex < this.state.fetchIndex + 5;
			fetchIndex++
		) {
			const restaurant = await axios.post(`${baseURL}/yelp/restaurant`, {
				restaurantID: this.state.bareRestaurants[fetchIndex].id,
			});
			newRestaurants[fetchIndex] = restaurant.data;
		}

		this.setState({
			fetchIndex,
			restaurants: newRestaurants,
			needMoreRestaurants: false,
		});
	};

	onSwiped = (index) => {
		//If less than 3 restaraunts left fetch more
		const needMoreRestaurants =
			this.state.fetchIndex - this.state.restaurantIndex < 3;

		this.setState({
			currentRestaurant: this.state.restaurants[index + 1],
			restaurantIndex: index + 1,
			currentImageIndex: 0,
			needMoreRestaurants,
		});
	};

	onSwipedRight = (index) => {};

	onSwipedLeft = (index) => {};

	renderRestaurant = (Restaurant, index) => {
		return (
			<RestaurantCard
				restaurant={this.state.currentRestaurant}
				images={this.state.currentRestaurant.photos}
			/>
		);
	};

	renderSwiper = () => {
		if (
			this.state.restaurants.length > 0 &&
			this.state.currentRestaurant !== null
		) {
			return (
				<Swiper
					cards={this.state.restaurants}
					renderCard={this.renderRestaurant}
					verticalSwipe={false}
					onSwiped={this.onSwiped}
					onSwipedRight={this.onSwipedRight}
					onSwipedLeft={this.onSwipedLeft}
					cardIndex={this.state.restaurantIndex}
				></Swiper>
			);
		}
	};

	render() {
		return (
			<Content contentContainerStyle={{ flex: 1 }}>
				<Grid>
					<Row size={1} style={{ backgroundColor: "#635DB7" }}>
						{this.renderSwiper()}
					</Row>
				</Grid>
			</Content>
		);
	}
}

export default Session;
