import React, { Component } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { withNavigation } from "react-navigation";
import Constants from "expo-constants";
import FriendsList from "./components/FriendsList";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5F1ED",
  },
  searchContainer: {
    width: windowWidth,
  },
  searchContainerStyle: {
    backgroundColor: "#F5F1ED",
    // backgroundColor: "#8ED5F5",
    // backgroundColor: "#00B2CA",
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

//todo: add keyboard listener to unfocus friend search

class Friends extends Component {
  state = { searchTerm: "" };

  handleSearchChange = (event) => {
    this.setState({ searchTerm: event.nativeEvent.text });
  };

  clearSearch = () => {
    this.setState({ searchTerm: "" });
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search for a friend by name"
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
        <FriendsList />
      </View>
    );
  }
}

export default withNavigation(Friends);

{
  /* <Button
          title="Go to a new stack view"
          onPress={() => this.props.navigation.navigate("StackExample")}
        /> */
}
