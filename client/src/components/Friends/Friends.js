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
    // justifyContent: "center",
    // paddingTop: Constants.statusBarHeight, //not needed really since this page has a header, maybe lower it
    backgroundColor: "#F5F1ED",
  },
  searchContainer: {
    width: windowWidth,
  },
});

//todo: only part in scrollview should be friends list?

class Friends extends Component {
  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.searchContainer}>
          <SearchBar placeholder="Type Here..." value="Test" lightTheme />
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
