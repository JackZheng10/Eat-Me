import React, { Component } from "react";
import { Container, Header, Content, Footer, Button, Text } from "native-base";
import { Modal } from "react-native";
import Categories from "./Categories";
import Location from "./Location";
import SessionSave from "./SessionSave";
import { createStackNavigator } from "@react-navigation/stack";

const CreateSessionStack = createStackNavigator();

/*
const CreateSessionStack = createStackNavigator();

function CreateSessionStackScreen(){
	return(
		<CreateSessionStack.Navigator
			screenOptions={({ route, navigation }) => ({
			// headerShown: false,
			headerTitleAlign: "left",
			headerStyle: { backgroundColor: "#00B2CA" },
			headerTitleStyle: { color: "white" },
			// headerRight: () => {
			//   return (
			//     <MaterialCommunityIcons
			//       name="silverware-fork"
			//       size={30}
			//       color={"white"}
			//       style={{ marginRight: 10 }}
			//     />
			//   );
			// },>
		})}
	>
			<CreateSessionStack.Screen name="Categories" component={Categories}/>
			<CreateSessionStack.Screen name="Location" component={Location}/>
			<CreateSessionStack.Screen name="Create Session" component={} />
		</CreateSessionStack.Navigator>
	);
}
*/

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
		createSessionStack: null,
	};

	componentDidMount = () => {};

	componentDidUpdate = () => {};

	renderSessionConfigurables = () => {
		const { sessionLevel } = this.state;

		if (sessionLevel === 0) {
			return this.renderCategories();
		} else if (sessionLevel === 1) {
			return this.renderLocation();
		} else if (sessionLevel === 2) {
			//Friends Selection View
			return this.renderSessionSave();
		} else {
			return this.renderSessionSave();
		}
	};

	renderCategories = () => {
		return (
			<Categories
				updateSessionConfigurable={this.updateSessionConfigurable}
				goBack={this.renderPreviousSessionLevel}
				exit={this.onModalClose}
			/>
		);
	};

	renderLocation = () => {
		return (
			<Location
				updateSessionConfigurable={this.updateSessionConfigurable}
				goBack={this.renderPreviousSessionLevel}
				exit={this.onModalClose}
			/>
		);
	};

	//Update View
	renderSessionSave = () => {
		const { sessionConfigurables } = this.state;

		return (
			<SessionSave
				createSession={this.createSession}
				goBack={this.renderPreviousSessionLevel}
				exit={this.onModalClose}
				sessionConfigurables={sessionConfigurables}
			/>
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
