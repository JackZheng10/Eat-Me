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
import { getCurrentUser, updateToken } from "../../../../helpers/session";
import { getUsersByID } from "../../../../helpers/user";
import io from "socket.io-client";
import axios from "axios";
import { SocketContext } from "../../../../contexts";
import baseURL from "../../../../../baseURL";
import List from "./components/List";
import DialogBox from "../../../utility/DialogBox";

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

//todo: add keyboard listener to unfocus friend search
//todo: decide on 10-digit phone or not
//todo: input validation for add friend?
//todo: format phone number differently?
//todo: ^ this prob solved just today. also add confirmation alert for deleting/declining?
//TODO: move current user fetch to app.js UNLESS we decide to lazy load all the other pages? or maybe we need to call getcurrentuser every time the token/user info updates
//todo: sort out when to use updatetoken and getcurrentuser
//todo: solve issue of listener being off but app doesnt technically mount again?? if remove friend while phone app closed it doesnt show sometimes?

class Friends extends Component {
  static contextType = SocketContext;

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: "",
      showAddDialog: false,
      addedPhone: "",
      showInboxDialog: false,
      friendRequests: [],
      friends: [],
      expoPushToken: "",
    };
  }

  componentDidMount = async () => {
    let currentUser = await getCurrentUser();

    //await on this? eh
    await this.addSocketListeners(this.context.SIO, currentUser.phone);

    //in case user had app closed, update their token and relevant info
    if (await updateToken(currentUser.phone)) {
      //todo: await on these? prob not so they fire both at once
      this.fetchFriendRequests();
      this.fetchFriends();
    }
  };

  addSocketListeners = async (socket, phone) => {
    //listen for an incoming friend request event, sent in the user's room
    //todo: maybe change these names/config
    socket.on("incomingFriendRequest", async () => {
      if (await updateToken(phone)) {
        //await on this? eh
        this.fetchFriendRequests();
      }
    });

    socket.on("acceptedFriend", async () => {
      if (await updateToken(phone)) {
        this.fetchFriendRequests();
        this.fetchFriends();
      }
    });

    socket.on("incomingFriend", async () => {
      if (await updateToken(phone)) {
        this.fetchFriends();
      }
    });

    socket.on("deletedFriend", async () => {
      if (await updateToken(phone)) {
        this.fetchFriends();
      }
    });

    socket.on("declinedFriend", async () => {
      if (await updateToken(phone)) {
        this.fetchFriendRequests();
      }
    });
  };

  fetchFriendRequests = async () => {
    let currentUser = await getCurrentUser();

    const users = await getUsersByID(currentUser.friendRequests);

    if (users.success) {
      this.setState({ friendRequests: users.message });
    } else {
      alert(users.message);
    }
  };

  //Helper too, but can we store this globally for access anywhere in our app?
  //^yes it can be provided but since its always attached to the token, no point really i think
  fetchFriends = async () => {
    let currentUser = await getCurrentUser();

    const users = await getUsersByID(currentUser.friends);

    //if successful, update the friends list
    if (users.success) {
      this.setState({ friends: users.message });
    } else {
      //if not, show the error msg
      alert(users.message);
    }
  };

  handleAddFriend = async () => {
    let currentUser = await getCurrentUser();

    try {
      const response = await axios.put(`${baseURL}/user/addFriend`, {
        phone: this.state.addedPhone,
        senderFriendRequests: currentUser.friendRequests,
        senderID: currentUser.ID,
        senderName: `${currentUser.fName} ${currentUser.lName}`,
      });

      alert(response.data.message);
      if (response.data.success) {
        this.toggleAddDialog();
      }
    } catch (error) {
      console.log("Error with adding friend: ", error);
      alert("Error with adding friend. Please try again.");
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

  toggleInboxDialog = () => {
    this.setState({ showInboxDialog: !this.state.showInboxDialog });
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

  handleSearchChange = (event) => {
    this.setState({ searchTerm: event.nativeEvent.text });
  };

  //todo: fully test pls
  handleFilteredFriends = () => {
    return this.state.friends.filter((item) => {
      const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      };

      if (this.state.searchTerm.trim() !== "") {
        const regexp = new RegExp(
          escapeRegExp(this.state.searchTerm.trim().toLowerCase())
        );

        if (item) {
          const result = `${item.fName} ${item.lName}`
            .trim()
            .toLowerCase()
            .match(regexp);

          return result && result.length > 0;
        } else {
          return false;
        }
      } else {
        return true;
      }
    });
  };

  clearSearch = () => {
    this.setState({ searchTerm: "" });
  };

  renderInbox = () => {
    return <List friendReqConfig={true} users={this.state.friendRequests} />;
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
          {/*todo: with or without?*/}
          <Divider style={{ backgroundColor: "grey", height: 0.2 }} />
        </View>
        <List friendReqConfig={false} users={this.handleFilteredFriends()} />
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
