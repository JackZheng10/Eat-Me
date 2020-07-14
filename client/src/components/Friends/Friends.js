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
import axios from "axios";
import baseURL from "../../../baseURL";
import FriendsList from "./components/FriendsList";
import DialogBox from "../components/DialogBox";

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
//todo: decide on 10-digit phone or not

class Friends extends Component {
  state = { searchTerm: "", showAddDialog: false, addedPhone: "" };

  handleSearchChange = (event) => {
    this.setState({ searchTerm: event.nativeEvent.text });
  };

  clearSearch = () => {
    this.setState({ searchTerm: "" });
  };

  toggleAddDialog = () => {
    //to prevent entered phone from being reset
    if (this.state.showAddDialog) {
      this.setState({
        showAddDialog: !this.state.showAddDialog,
        addedPhone: "",
      });
    } else {
      this.setState({ showAddDialog: !this.state.showAddDialog });
    }
  };

  handleAddedPhoneChange = (event) => {
    let input = event.nativeEvent.text;

    const phoneRegex = /^[0-9\b]+$/;

    if (input === "" || phoneRegex.test(input)) {
      if (input.length > 10) {
        input = input.substr(0, 10);
      }
      this.setState({ addedPhone: input });
    }
  };

  handleAddFriend = async () => {
    try {
      const response = await axios.post(`${baseURL}/user/addFriend`, {
        phone: this.state.addedPhone,
      });

      if (response.data.success) {
        alert("Totally sent a friend request");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Error with adding friend. Please try again.");
    }
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <DialogBox
          overlayProps={{
            isVisible: this.state.showAddDialog,
            onBackdropPress: this.toggleAddDialog,
          }}
          buttons={[
            {
              label: "Cancel",
              color: "#F75555",
              onPress: this.toggleAddDialog,
            },
            {
              label: "Add",
              color: "#8ED5F5",
              onPress: this.handleAddFriend,
            },
          ]}
          input={true}
          inputProps={{
            placeholder: "Phone Number",
            onChange: this.handleAddedPhoneChange,
            value: this.state.addedPhone,
          }}
          title="Add a Friend"
          description="Please enter your friend's phone number to send them a friend request."
        />
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
            onPress={this.toggleAddDialog}
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
