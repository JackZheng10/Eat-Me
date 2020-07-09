import React, { Component } from "react";
import {
	Container,
	Header,
	Content,
	Footer,
	Button,
	Text,
	Left,
	Icon,
	Body,
	Title,
	Right,
	Item,
	Input,
} from "native-base";
import MapView, { Marker } from "react-native-maps";
import baseURL from "../../baseURL";
import axios from "axios";

/* 
    Native Module cannot be null 
    Need to link to IOS
    Need possible better Location Service to work with Android
*/
//import Geolocation from "react-native-geolocation-service";

import { Row, Grid } from "react-native-easy-grid";

class Location extends Component {
	state = {
		searchTerm: "",
		locationLatitude: 26.05172755,
		locationLongitude: -80.2112422592151,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	};

	componentDidMount = () => {
		navigator.geolocation.getCurrentPosition(this.setCurrentPosition);
	};

	setCurrentPosition = (currentPosition) => {
		const { latitude, longitude } = currentPosition.coords;

		this.setState({
			locationLatitude: latitude,
			locationLongitude: longitude,
		});
	};

	updateSearchTerm = (event) => {
		const { text } = event.nativeEvent;

		this.setState({
			searchTerm: text,
		});
	};

	setPosition = (position) => {
		this.setState({
			locationLongitude: position.longitude,
			locationLatitude: position.latitude,
		});
	};

	addLocationToSession = () => {
		const location = {
			latitude: this.state.locationLatitude,
			longitude: this.state.locationLongitude,
		};

		this.props.updateSessionConfigurable(location);
	};

	submitSearchTerm = async () => {
		const places = await axios.post(`${baseURL}/google/find-places`, {
			searchTerm: this.state.searchTerm,
		});

		if (places.data.candidates.length > 0) {
			const newMarker = {
				nativeEvent: {
					coordinate: {
						latitude: places.data.candidates[0].geometry.location.lat,
						longitude: places.data.candidates[0].geometry.location.lng,
					},
				},
			};
			this.placeLocationMarker(newMarker);
		} else {
			alert("Search Again");
		}
	};

	placeLocationMarker = (marker) => {
		const markerCoordinate = marker.nativeEvent.coordinate;
		const { latitude, longitude } = markerCoordinate;

		this.map.animateToRegion({
			latitude,
			longitude,
			latitudeDelta: this.state.latitudeDelta,
			longitudeDelta: this.state.longitudeDelta,
		});

		this.setState({
			locationLatitude: latitude,
			locationLongitude: longitude,
		});
	};

	onRegionChangeComplete = (newRegion) => {
		const { latitudeDelta, longitudeDelta } = newRegion;

		this.setState({
			latitudeDelta,
			longitudeDelta,
		});
	};

	renderMap = () => {
		const {
			locationLatitude,
			locationLongitude,
			latitudeDelta,
			longitudeDelta,
		} = this.state;

		return (
			<MapView
				ref={(map) => {
					this.map = map;
				}}
				provider="google"
				style={{ flex: 1 }}
				initialRegion={{
					latitude: locationLatitude,
					longitude: locationLongitude,
					latitudeDelta: latitudeDelta,
					longitudeDelta: longitudeDelta,
				}}
				onRegionChangeComplete={this.onRegionChangeComplete}
				showsUserLocation={true}
				onPress={this.placeLocationMarker}
			>
				<Marker
					coordinate={{
						latitude: locationLatitude,
						longitude: locationLongitude,
					}}
				/>
			</MapView>
		);
	};

	render() {
		return (
			<Container>
				<Header>
					<Left>
						<Button transparent onPress={() => this.props.goBack()}>
							<Icon name="arrow-back" />
						</Button>
					</Left>
					<Body>
						<Title>Location</Title>
					</Body>
					<Right>
						<Button hasText transparent>
							<Text>Cancel</Text>
						</Button>
					</Right>
				</Header>
				<Content contentContainerStyle={{ flex: 1 }}>
					<Grid>
						<Row size={1}>
							<Item searchBar rounded style={{ width: "100%" }}>
								<Icon name="search" />
								<Input
									onEndEditing={this.submitSearchTerm}
									placeholder="Search here"
									onChange={this.updateSearchTerm}
								/>
								<Button onPress={this.submitSearchTerm}>
									<Text>Find</Text>
								</Button>
							</Item>
						</Row>
						<Row size={9}>{this.renderMap()}</Row>
					</Grid>
				</Content>
				<Footer>
					<Left>
						<Text>
							Latitude: {this.state.locationLatitude}, Longitude:{" "}
							{this.state.locationLongitude}
						</Text>
					</Left>
					<Right>
						<Button onPress={this.addLocationToSession}>
							<Text>Add Location</Text>
						</Button>
					</Right>
				</Footer>
			</Container>
		);
	}
}

export default Location;
