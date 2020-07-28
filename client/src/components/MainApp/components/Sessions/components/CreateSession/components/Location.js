import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Input } from "react-native-elements";
import MapView, { Marker } from "react-native-maps";
import baseURL from "../../../../../../../../baseURL";
import axios from "axios";
import ModalStyles from "../styles/ModalStyles";
import CreateSessionHeader from "./CreateSessionHeader";
import CreateSessionFooter from "./CreateSessionFooter";

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
		const { latitude, longitude } = this.props.selectedLocation;

		const locationSelected = this.props.selectedLocation.latitude !== 0;

		if (locationSelected) {
			this.updateLocation(latitude, longitude);
		} else {
			navigator.geolocation.getCurrentPosition(this.setCurrentPosition);
		}
	};

	setCurrentPosition = (currentPosition) => {
		const { latitude, longitude } = currentPosition.coords;

		this.updateLocation(latitude, longitude);
	};

	updateSearchTerm = (event) => {
		const { text } = event.nativeEvent;

		this.setState({
			searchTerm: text,
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

		const locationFound = places.data.candidates.length > 0;

		//Maybe change method so response looks at success property
		if (locationFound) {
			const { lat, lng } = places.data.candidates[0].geometry.location;
			this.animateToRegion(lat, lng);
			this.updateLocation(lat, lng);
		} else {
			alert("Address not found. Try Again");
		}
	};

	placeLocationMarker = (marker) => {
		const { latitude, longitude } = marker.nativeEvent.coordinate;

		this.animateToRegion(latitude, longitude);

		this.updateLocation(latitude, longitude);
	};

	animateToRegion = (latitude, longitude) => {
		this.map.animateToRegion({
			latitude,
			longitude,
			latitudeDelta: this.state.latitudeDelta,
			longitudeDelta: this.state.longitudeDelta,
		});
	};

	updateLocation = (locationLatitude, locationLongitude) => {
		this.setState({
			locationLatitude,
			locationLongitude,
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

	setRightInputIcon = () => {
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
				<CreateSessionHeader
					goBack={this.props.goBack}
					exit={this.props.exit}
					title="Choose your location"
				/>
				<View style={ModalStyles.content}>
					<View style={{ flex: 1 }}>
						{this.renderMap()}

						<View style={styles.locationInputView}>
							<Input
								onChange={this.updateSearchTerm}
								placeholder="Search"
								leftIcon={{ name: "search" }}
								rightIcon={this.setRightInputIcon}
								inputContainerStyle={styles.locationInputContainer}
							/>
						</View>
					</View>
				</View>
				<CreateSessionFooter
					title="Add Location"
					updateSession={this.addLocationToSession}
				/>
			</View>
		);
	}
}

export default Location;
