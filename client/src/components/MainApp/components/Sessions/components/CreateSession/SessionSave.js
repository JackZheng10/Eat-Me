import React, { Component } from "react";
import { View } from "react-native";
import { Header, Icon, Button, Text } from "react-native-elements";
import ModalStyles from "./styles/ModalStyles";

class SessionSave extends Component {
	state = {};

	componentDidMount = () => {};

	renderSessionSaveLeft = () => {
		return <Icon onPress={this.props.goBack} name="arrow-back" color="#FFF" />;
	};

	renderSessionSaveRight = () => {
		//Consider Screen sizes for these elements
		return <Icon name="clear" onPress={this.props.exit} color="#FFF" />;
	};

	render() {
		const { sessionConfigurables } = this.props;

		return (
			<View style={{ flex: 1 }}>
				<View style={{ flex: 1 }}>
					<Header
						containerStyle={{ backgroundColor: "#00B2CA" }}
						leftComponent={this.renderSessionSaveLeft}
						centerComponent={{
							text: "Session Details",
							style: ModalStyles.headerCenterText,
						}}
						rightComponent={this.renderSessionSaveRight}
					/>
				</View>
				<View style={ModalStyles.content}>
					<View style={{ flex: 1, justifyContent: "space-around" }}>
						<View style={{ flex: 1 }}>
							<Text>{sessionConfigurables.sessionCategories}</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text>
								{sessionConfigurables.sessionLocation.latitude},{" "}
								{sessionConfigurables.sessionLocation.longitude}
							</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text>{sessionConfigurables.sessionFriends}</Text>
						</View>
					</View>
				</View>
				<View style={ModalStyles.footer}>
					<Button
						onPress={this.props.createSession}
						buttonStyle={ModalStyles.updateSessionButton}
						title="Create Session"
					/>
				</View>
			</View>
		);
	}
}

export default SessionSave;
