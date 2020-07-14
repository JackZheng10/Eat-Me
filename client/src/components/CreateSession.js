import React, { Component } from "react";
import { Container, Header, Content, Footer, Button, Text } from "native-base";
import { Modal } from "react-native";
import Categories from "./Categories";
import Location from "./Location";

class CreateSession extends Component {
	state = {
		sessionLevel: 0,
		sessionConfigurables: {
			sessionCategories: [],
			sessionLocation: {
				latitude: 0,
				longitude: 0,
			},
			sessionFriends: [],
		},
	};

	componentDidMount = () => {};

	componentDidUpdate = () => {};

	renderSessionConfigurables = () => {
		const { sessionLevel } = this.state;
		if (sessionLevel === 0) {
			return (
				<Categories
					updateSessionConfigurable={this.updateSessionConfigurable}
					goBack={this.renderPreviousSessionLevel}
				/>
			);
		} else if (sessionLevel === 1) {
			return (
				<Location
					updateSessionConfigurable={this.updateSessionConfigurable}
					goBack={this.renderPreviousSessionLevel}
				/>
			);
		} else if (sessionLevel === 2) {
			//Friends Selection View
			return this.renderSessionSave();
		} else {
			return this.renderSessionSave();
		}
	};

	//Update View
	renderSessionSave = () => {
		const { sessionConfigurables } = this.state;
		return (
			<Container>
				<Header>
					<Text>Session Review</Text>
				</Header>
				<Content>
					<Text>{sessionConfigurables.sessionCategories[0]}</Text>
					<Text>
						{sessionConfigurables.sessionLocation.latitude},{" "}
						{sessionConfigurables.sessionLocation.longitude}
					</Text>
					<Text>{sessionConfigurables.sessionFriends}</Text>
				</Content>
				<Footer>
					<Button onPress={this.createSession}>
						<Text>Create Session</Text>
					</Button>
				</Footer>
			</Container>
		);
	};

	createSession = () => {
		console.log("Save Session");
	};

	updateSessionConfigurable = (sessionConfigurable) => {
		let { sessionConfigurables, sessionLevel } = this.state;
		if (sessionLevel === 0) {
			sessionConfigurables.sessionCategories = sessionConfigurable;
		} else if (sessionLevel === 1) {
			sessionConfigurables.sessionLocation = sessionConfigurable;
		} else if (sessionLevel === 2) {
			sessionConfigurables.sessionFriends = sessionConfigurable;
		}

		this.setState({
			sessionLevel: this.state.sessionLevel + 1,
			sessionConfigurables,
		});
	};

	renderPreviousSessionLevel = () => {
		const { sessionLevel } = this.state;
		if (sessionLevel - 1 >= 0) {
			this.setState({
				sessionLevel: sessionLevel - 1,
			});
		} else {
			//Clean Modal too
			this.onModalClose();
		}
	};

	onModalClose = () => {
		console.log("Modal Closing");
		this.props.exitModal();
	};

	render() {
		const { modalVisible } = this.props;
		return (
			<Modal
				animationType="slide"
				transparent="true"
				visible={modalVisible}
				onRequestClose={this.onModalClose}
			>
				{this.renderSessionConfigurables()}
			</Modal>
		);
	}
}

export default CreateSession;
