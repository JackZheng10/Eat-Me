import React, { Component } from "react";
import { StyleSheet, View } from "react-native";

import { Header, Icon, Button, Input, SearchBar } from "react-native-elements";
import MapView, { Marker } from "react-native-maps";
import baseURL from "../../../../../baseURL";
import axios from "axios";
import ModalStyles from "../styles/ModalStyles";

/* 
    Native Module cannot be null 
    Need to link to IOS
    Need possible better Location Service to work with Android
*/
//import Geolocation from "react-native-geolocation-service";

const styles = StyleSheet.create({
	locationInputView: {
		position: "absolute",
		top: 20,
		width: "100%",
	},
	locationInputContainer: {
		borderRadius: 50,
		borderColor: "black",
		borderWidth: 1,
		backgroundColor: "white",
	},
});

class Location extends Component {
	state = {
		searchTerm: "",
		locationLatitude: 26.05172755,
		locationLongitude: -80.2112422592151,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	};

	componentDidMount = () => {
		if (this.props.selectedLocation.latitude !== 0) {
			const selectedPostion = {
				coords: {
					latitude: this.props.selectedLocation.latitude,
					longitude: this.props.selectedLocation.longitude,
				},
			};
			this.setCurrentPosition(selectedPostion);
		} else {
			navigator.geolocation.getCurrentPosition(this.setCurrentPosition);
		}
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

	//Add name of Address to location object
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

	renderLocationHeadLeft = () => {
		return <Icon onPress={this.props.goBack} name="arrow-back" color="#FFF" />;
	};

	renderLocationHeadRight = () => {
		//Consider Screen sizes for these elements
		return <Icon name="clear" onPress={this.props.exit} color="#FFF" />;
	};

	setRightIcon = () => {
		return (
			<Button
				title="Find"
				buttonStyle={{ borderRadius: 50, backgroundColor: "#00B2CA" }}
				onPress={this.submitSearchTerm}
			/>
		);
	};

	render() {
		return (
			<View style={{ flex: 1 }}>
				<View style={{ flex: 1 }}>
					<Header
						containerStyle={{ backgroundColor: "#00B2CA" }}
						leftComponent={this.renderLocationHeadLeft}
						centerComponent={{
							text: "Choose your location",
							style: ModalStyles.headerCenterText,
						}}
						rightComponent={this.renderLocationHeadRight}
					/>
				</View>
				<View style={ModalStyles.content}>
					<View style={{ flex: 1 }}>
						{this.renderMap()}
						<View style={styles.locationInputView}>
							<Input
								onChange={this.updateSearchTerm}
								placeholder="Search"
								leftIcon={{ name: "search" }}
								rightIcon={this.setRightIcon}
								inputContainerStyle={styles.locationInputContainer}
							/>
						</View>
					</View>
				</View>
				<View style={ModalStyles.footer}>
					<Button
						onPress={this.addLocationToSession}
						buttonStyle={ModalStyles.updateSessionButton}
						title="Add Location"
					/>
				</View>
			</View>
		);
	}
}

export default Location;
