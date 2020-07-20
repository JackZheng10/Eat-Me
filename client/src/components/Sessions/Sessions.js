import React, { Component } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import { withNavigation } from "react-navigation";

import baseURL from "../../../baseURL.js";
import axios from "axios";
import CreateSession from "../CreateSession/CreateSession";
import { ListItem, Text, Icon } from "react-native-elements";

const styles = StyleSheet.create({
	ListItem: {
		margin: 10,
		borderStyle: "solid",
		borderColor: "#00B2CA",
		borderWidth: 2,
		borderRadius: 50,
	},
	containerStyle: {
		backgroundColor: "#fcfbfa",
		borderStyle: "solid",
		borderColor: "#F79256",
		borderRadius: 50,
	},
	titleStyle: {
		fontWeight: "bold",
		color: "#F79256",
	},
	subtitleStyle: {
		color: "black",
	},
	emptySession: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	addSessionContainer: {
		position: "absolute",
		bottom: 25,
		right: 50,
	},
	sessionsContainer: {
		flex: 1,
		backgroundColor: "#F5F1ED",
	},
});

class Sessions extends Component {
	state = {
		SessionList: [],
		modalVisible: false,
	};

	componentDidMount = async () => {
		//Get session List from DB, Transform Data into individual componenets
		const Sessions = await axios.post(baseURL + "/simple/getUserSessions", {
			ID: 1,
		});
		this.setState({ SessionList: Sessions.data.Sessions });
	};

	setSessionsView = () => {
		if (this.state.SessionList.length == 0)
			return this.renderEmptySessionsView();
		else {
			return <ScrollView>{this.renderSessions()}</ScrollView>;
		}
	};

	renderEmptySessionsView = () => {
		return (
			<View style={styles.emptySession}>
				<Text h3 style={{ color: "#F79256" }}>
					Create a New Session!
				</Text>
			</View>
		);
	};

	renderSession = (sessionDetails) => {
		this.props.navigation.push("Session", { sessionDetails });
	};

	renderSessions = () => {
		return this.state.SessionList.map((Session) => {
			return (
				<ListItem
					onPress={() => this.renderSession(Session)}
					key={Session._id}
					leftElement={this.renderSessionMembers}
					title={"Session.Members"}
					titleStyle={styles.titleStyle}
					subtitle={Session.Status}
					subtitleStyle={styles.subtitleStyle}
					avatar
					style={styles.ListItem}
					containerStyle={styles.containerStyle}
					rightIcon={this.renderSessionStatus(Session.Status)}
				/>
			);
		});
	};

	renderSessionMembers = () => {
		//Idea - Return circular picture of all friends in session. Small though,
		return <Icon name="person" />;
	};

	renderSessionStatus = (sessionStatus) => {
		let sessionIcon;
		switch (sessionStatus) {
			case "No Match": {
				sessionIcon = "check";
				break;
			}
			case "No Progress": {
				sessionIcon = "hourglass-empty";
				break;
			}
			case "Match": {
				sessionIcon = "check";
				break;
			}
		}

		return (
			<Icon name={sessionIcon} color="#F79256" style={{ marginRight: 10 }} />
		);
	};

	createNewSession = () => {
		this.setState({ modalVisible: true });
	};

	exitModal = () => {
		this.setState({ modalVisible: false });
	};

	render() {
		return (
			<View style={styles.sessionsContainer}>
				{this.setSessionsView()}

				<CreateSession
					modalVisible={this.state.modalVisible}
					exitModal={this.exitModal}
				/>

				<View style={styles.addSessionContainer}>
					<Icon
						onPress={this.createNewSession}
						name="add"
						type="material"
						color="#F79256"
						raised
						reverse
					/>
				</View>
			</View>
		);
	}
}

export default withNavigation(Sessions);
