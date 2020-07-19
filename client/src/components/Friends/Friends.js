import React, { Component } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  ScrollView,
  Dimensions,
  YellowBox,
} from "react-native";
import { SearchBar, Icon, Divider, Badge } from "react-native-elements";
import { withNavigation } from "react-navigation";
import { getCurrentUser, updateToken } from "../../helpers/session";
import io from "socket.io-client";
import axios from "axios";
import baseURL from "../../../baseURL";
import List from "./components/List";
import DialogBox from "../components/DialogBox";

const socket = io("http://10.0.0.232:6000/");

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
    width: windowWidth - 135,
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
    right: 1,
    top: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    zIndex: 1,
  },
  floatingBadge: {
    position: "absolute",
    right: 72,
    top: 5,
    zIndex: 2,
  },
});

const testItems = [
  {
    fName: "Amy",
    lName: "Hurha",
    phone: "9322343245",
  },
];

//todo: add keyboard listener to unfocus friend search
//todo: decide on 10-digit phone or not
//todo: input validation for add friend?
//todo: format phone number differently?
//todo: get rid of stupid timer warning
//todo: code refactoring, maybe ugly in places
//todo: disable multiple requests to same person, but what if the sender changes phone number...? maybe disable phone # change in first place.

class Friends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: "",
      showAddDialog: false,
      addedPhone: "",
      showInboxDialog: false,
      friendRequests: [],
    };
  }

  componentDidMount = async () => {
    this.fetchFriendRequests();
  };

  fetchFriendRequests = async () => {
    let currentUser = await getCurrentUser();

    this.setState({ friendRequests: currentUser.friendRequests });
  };

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
    let currentUser = await getCurrentUser();

    try {
      const response = await axios.post(`${baseURL}/user/addFriend`, {
        phone: this.state.addedPhone,
        from: currentUser.phone,
        fName: currentUser.fName,
        lName: currentUser.lName,
      });

      if (response.data.success) {
        alert(response.data.message);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Error with adding friend. Please try again.");
    }
  };

  toggleInboxDialog = () => {
    this.setState({ showInboxDialog: !this.state.showInboxDialog });
  };

  renderInbox = () => {
    return <List friendReqConfig={true} items={this.state.friendRequests} />;
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <DialogBox
          overlayProps={{
            isVisible: this.state.showInboxDialog,
            onBackdropPress: this.toggleInboxDialog,
          }}
          buttons={[
            {
              label: "Close",
              color: "#F75555",
              onPress: this.toggleInboxDialog,
            },
          ]}
          input={false}
          description={false}
          showContent={true}
          content={this.renderInbox()}
          title="Friend Requests"
        />
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
          showContent={false}
          title="Add a Friend"
          description={true}
          description="Please enter your friend's phone number to send them a friend request."
        />
        <View style={styles.searchContainer}>
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
          <Divider style={{ backgroundColor: "grey", height: 0.1 }} />
        </View>
        <List friendReqConfig={false} items={testItems} />
        <View style={styles.floatingButton}>
          <Icon
            name="inbox"
            type="material"
            color="#F79256"
            raised
            reverse
            onPress={this.toggleInboxDialog}
          />
          <Icon
            name="add"
            type="material"
            color="#F79256"
            raised
            reverse
            onPress={this.toggleAddDialog}
          />
        </View>
        <View style={styles.floatingBadge}>
          <Badge
            status="success"
            value={this.state.friendRequests.length}
            containerStyle={{
              display: this.state.friendRequests.length >= 1 ? "flex" : "none",
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
