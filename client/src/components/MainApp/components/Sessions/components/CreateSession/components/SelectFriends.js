import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { SearchBar } from "react-native-elements";
import ModalStyles from "../styles/ModalStyles";
import { ScrollView } from "react-native-gesture-handler";
import FriendItem from "./FriendItem";
import { fetchFriends } from "../../../../../../../helpers/user";
import CreateSessionHeader from "./CreateSessionHeader";
import CreateSessionFooter from "./CreateSessionFooter";

const styles = StyleSheet.create({
	searchContainerStyle: {
		backgroundColor: "#F5F1ED",
		width: "100%",
		borderBottomColor: "transparent",
		borderTopColor: "transparent",
	},
	searchInputStyle: {
		color: "black",
		marginRight: 5,
		marginLeft: 5,
	},
	searchInputContainerStyle: {
		backgroundColor: "white",
		borderRadius: 40,
	},
});

class SelectFriends extends Component {
	state = {
		searchTerm: "",
		friends: [],
		selectedFriends: [...this.props.selectedFriends],
	};

	componentDidMount = () => {
		this.loadFriends();
	};

	loadFriends = async () => {
		const friends = await fetchFriends();
		this.setState({ friends });
	};

	addFriendsToSession = () => {
		this.props.updateSessionConfigurable(this.state.selectedFriends);
	};

	renderFriends = () => {
		return this.state.friends.map((friend, i) => {
			const selected = this.determineSelectedStatus(friend);
			return (
				<FriendItem
					key={i}
					friend={friend}
					onSelect={this.onFriendSelect}
					selected={selected}
				/>
			);
		});
	};

	determineSelectedStatus = (friend) => {
		const { selectedFriends } = this.state;
		let selected = false;

		for (let i = 0; i < selectedFriends.length; i++) {
			if (selectedFriends[i].ID == friend.ID) {
				selected = true;
				break;
			}
		}

		return selected;
	};

	onFriendSelect = (friend, shouldAdd) => {
		let newFriends;
		if (shouldAdd) {
			newFriends = [...this.state.selectedFriends, friend];
		} else {
			newFriends = this.state.selectedFriends.filter((originalFriends) => {
				return originalFriends !== friend;
			});
		}

		this.setState({
			selectedFriends: newFriends,
		});
	};

	handleSearchChange = (event) => {
		const searchTerm = event.nativeEvent.text;

		const friends = this.state.friends.filter((friend) =>
			friend.fname.includes(searchTerm)
		);

		this.setState({ searchTerm: event.nativeEvent.text, friends });
	};

	clearSearch = () => {
		this.setState({ searchTerm: "" });
	};

	render() {
		return (
			<View style={{ flex: 1 }}>
				<CreateSessionHeader
					title="Choose Friends"
					goBack={this.props.goBack}
					exit={this.props.exit}
				/>

				<View style={ModalStyles.content}>
					<View>
						<SearchBar
							placeholder="Search by name"
							platform="default"
							value={this.state.searchTerm}
							lightTheme
							containerStyle={styles.searchContainerStyle}
							inputStyle={styles.searchInputStyle}
							inputContainerStyle={styles.searchInputContainerStyle}
							searchIcon={{ color: "#00B2CA" }}
							clearIcon={{ color: "#00B2CA" }}
							placeholderTextColor={"#00B2CA"}
							onChange={this.handleSearchChange}
							onClear={this.clearSearch}
						/>
					</View>
					<ScrollView>{this.renderFriends()}</ScrollView>
				</View>

				<CreateSessionFooter
					title="Add Friends"
					updateSession={this.addFriendsToSession}
				/>
			</View>
		);
	}
}

export default SelectFriends;
