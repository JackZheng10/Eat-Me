import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-elements";
import ModalStyles from "../styles/ModalStyles";
import CreateSessionHeader from "./CreateSessionHeader";
import CreateSessionFooter from "./CreateSessionFooter";

const styles = StyleSheet.create({
	sectionHeader: {
		color: "#F79256",
	},
});

class SessionSave extends Component {
	state = {};

	componentDidMount = () => {};

	renderSessionFriendsList = () => {
		const friendsList = this.props.sessionConfigurables.sessionFriends;
		const friendsListText = friendsList.reduce((friendText, friend) => {
			return {
				names:
					friendText.fName +
					" " +
					friendText.lName +
					", " +
					friend.fName +
					" " +
					friend.lName,
			};
		});

		return (
			<>
				<Text style={styles.sectionHeader} h3>
					Selected Friends:
				</Text>
				<Text h4>
					{friendsList.length > 0
						? friendsListText.names
						: `${friendsListText.fName} ${friendsListText.lName}`}
				</Text>
			</>
		);
	};

	renderSessionLocation = () => {
		const { sessionLocation } = this.props.sessionConfigurables;

		//Change later to display address name not coordinates
		const addressName =
			sessionLocation.latitude + ", " + sessionLocation.longitude;
		return (
			<>
				<Text style={styles.sectionHeader} h3>
					Selected Location:
				</Text>
				<Text h4>{addressName}</Text>
			</>
		);
	};

	renderSessionCategories = () => {
		const categories = this.props.sessionConfigurables.sessionCategories;
		const selectedCategoriesText = categories.reduce(
			(categoryText, category) => {
				return categoryText + `, ${category}`;
			}
		);

		return (
			<>
				<Text style={styles.sectionHeader} h3>
					Selected Categories:
				</Text>
				<Text h4>{selectedCategoriesText}</Text>
			</>
		);
	};

	render() {
		return (
			<View style={{ flex: 1 }}>
				<CreateSessionHeader
					title="Session Details"
					goBack={this.props.goBack}
					exit={this.props.exit}
				/>

				<View style={ModalStyles.content}>
					<View style={{ flex: 1, justifyContent: "space-around" }}>
						<View style={{ flex: 1, margin: 10 }}>
							{this.renderSessionCategories()}
						</View>

						<View style={{ flex: 1, margin: 10 }}>
							{this.renderSessionLocation()}
						</View>

						<View style={{ flex: 1, margin: 10 }}>
							{this.renderSessionFriendsList()}
						</View>
					</View>
				</View>

				<CreateSessionFooter
					title="Create Session"
					updateSession={this.props.createSession}
				/>
			</View>
		);
	}
}

export default SessionSave;
