import { Text, View, Button, StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";

import React, { Component } from "react";
import {
	List,
	ListItem,
	Icon,
	Thumbnail,
	Left,
	Right,
	Body,
	Container,
	Content,
	Footer,
} from "native-base";
//import Session from "../Session.js";
import baseURL from "../../../baseURL.js";
import axios from "axios";
import CreateSession from "../CreateSession/CreateSession";

const styles = StyleSheet.create({
	ListItem: {
		flex: 1,
		paddingLeft: 5,
		margin: 10,
		borderWidth: 2,
	},
	FloatingButton: {
		//Here is the trick
		position: "absolute",
		width: 50,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		right: 50,
		bottom: 150,
		backgroundColor: "#A0F",
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
		else return this.renderSessions();
	};

	renderEmptySessionsView = () => {
		return (
			<Text>
				No Sessions right now :( {"\n"}
				Create a new Session!!
			</Text>
		);
	};

	renderSessions = () => {
		return <List>{this.renderSessionListItems()}</List>;
	};

	renderSession = (sessionDetails) => {
		this.props.navigation.push("Session", { sessionDetails });
	};

	renderSessionListItems = () => {
		return this.state.SessionList.map((Session) => {
			return (
				<ListItem
					onPress={() => this.renderSession(Session)}
					key={Session._id}
					style={styles.ListItem}
					avatar
				>
					<Left>
						<Icon name="person" />
					</Left>
					<Body>
						<Text>{Session.Members}</Text>
						<Text numberOfLines={1} note>
							{Session.ID}
						</Text>
					</Body>
					<Right>
						<Text note>{Session.Status}</Text>
					</Right>
				</ListItem>
			);
		});
	};

	createNewSession = () => {
		this.setState({ modalVisible: true });
	};

	exitModal = () => {
		this.setState({ modalVisible: false });
	};

	render() {
		return (
			<>
				<Content>
					{this.setSessionsView()}

					<CreateSession
						modalVisible={this.state.modalVisible}
						exitModal={this.exitModal}
					/>
				</Content>
				<Button
					onPress={this.createNewSession}
					title="New"
					style={styles.FloatingButton}
				>
					<Text>+</Text>
				</Button>
			</>
		);
	}
}

export default withNavigation(Sessions);
