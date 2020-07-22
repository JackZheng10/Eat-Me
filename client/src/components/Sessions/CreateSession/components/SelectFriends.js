import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Header, Icon, Button, SearchBar } from "react-native-elements";
import ModalStyles from "../styles/ModalStyles";
import { ScrollView } from "react-native-gesture-handler";
import FakeFriends from "../helpers/FakeFriends";
import FriendItem from "./FriendItem";

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
		friends: [...FakeFriends],
		selectedFriends: [...this.props.selectedFriends],
	};

	componentDidMount = () => {
		//Fetch Friends
		//this.fetchFriends();
	};

	componentDidUpdate = () => {};

	fetchFriends = async () => {
		//Refer to Friends.js
		/*
        let currentUser = await getCurrentUser();
    
        const users = await this.fetchUsersByID(currentUser.friends);
    
        if (users.success) {
          this.setState({ friends: users.message });
        } else {
          alert(users.message);
        }
        */
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
		let selected = false;

		const { selectedFriends } = this.state;
		for (let i = 0; i < selectedFriends.length; i++) {
			//Need better matching like maybe an ID
			if (selectedFriends[i].name == friend.name) {
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

	renderSelectFriendsHeadLeft = () => {
		return <Icon onPress={this.props.goBack} name="arrow-back" color="#FFF" />;
	};

	renderSelectFriendsHeadRight = () => {
		//Consider Screen sizes for these elements
		return <Icon name="clear" onPress={this.props.exit} color="#FFF" />;
	};

	handleSearchChange = (event) => {
		const searchTerm = event.nativeEvent.text;
		const friends = FakeFriends.filter((friend) =>
			friend.name.includes(searchTerm)
		);
		this.setState({ searchTerm: event.nativeEvent.text, friends });
	};

	clearSearch = () => {
		this.setState({ searchTerm: "" });
	};

	render() {
		return (
			<View style={{ flex: 1 }}>
				<View style={{ flex: 1 }}>
					<Header
						containerStyle={{ backgroundColor: "#00B2CA" }}
						leftComponent={this.renderSelectFriendsHeadLeft}
						centerComponent={{
							text: "Choose Friends",
							style: ModalStyles.headerCenterText,
						}}
						rightComponent={this.renderSelectFriendsHeadRight}
					/>
				</View>
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
				<View style={ModalStyles.footer}>
					<Button
						onPress={this.addFriendsToSession}
						buttonStyle={ModalStyles.updateSessionButton}
						title="Add Friends"
					/>
				</View>
			</View>
		);
	}
}

export default SelectFriends;
