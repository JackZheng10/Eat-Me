import React, { Component } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { SearchBar, Icon, Divider } from "react-native-elements";
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
    width: windowWidth - 60,
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
  floatingButton: {
    position: "absolute",
    right: 0,
    top: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
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
          <Divider style={{ backgroundColor: "grey", height: 0.1 }} />
        </View>
        <FriendsList />
        <View style={styles.floatingButton}>
          <Icon
            name="add"
            type="material"
            color="#F79256"
            raised
            reverse
            onPress={() => {
              console.log("pressed floating button");
            }}
          />
        </View>
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
