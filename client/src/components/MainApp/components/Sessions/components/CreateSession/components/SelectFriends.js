import React, { Component } from "react";
import { View } from "react-native";
import { SearchBar } from "react-native-elements";
import { ModalStyles, SelectFriendsStyles as styles } from "./styles";
import { ScrollView } from "react-native-gesture-handler";
import FriendItem from "./FriendItem";
import { fetchFriends } from "../../../../../../../helpers/user";
import CreateSessionHeader from "./CreateSessionHeader";
import CreateSessionFooter from "./CreateSessionFooter";

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
    const { friends, selectedFriends } = this.state;

    if (selectedFriends.length > 0 || friends.length == 0) {
      this.props.updateSessionConfigurable(this.state.selectedFriends);
    } else {
      //Future Toast Message
      alert("Invite some friends!");
    }
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
