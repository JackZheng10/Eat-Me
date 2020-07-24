import React, { Component } from "react";
import {
  Text,
  View,
  Platform,
  Keyboard,
  StyleSheet,
  YellowBox,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppLoading, Notifications } from "expo";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { MainApp, Startup } from "./src/components";
import {
  getCurrentUser,
  updateToken,
  getStoredLogin,
} from "./src/helpers/session";
import axios from "axios";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import baseURL from "./baseURL";

//DOCS:
//bottom navigator docs: https://reactnavigation.org/docs/bottom-tab-navigator/
//stack navigation docs: https://reactnavigation.org/docs/stack-navigator/#props
//navigation prop docs: https://reactnavigation.org/docs/navigation-prop/
//available icons for RNE and as a raw icon (seen in this file): https://icons.expo.fyi/
//color palette: https://coolors.co/f79256-8ed5f5-f5f1ed-00b2ca
//socket.io basics: https://medium.com/@rloperena/quick-guide-to-socket-io-basics-59b07c39c6ec

//IMPORTANT NOTE: the stack navigator will save the route that you're on. for example:
//-go to settings, then the example stack view, then away, then back, and you'll see youre still in the stacked view
//-this is probably good behavior for our usage, but im sure theres a workaround in the nav. prop or stack nav. docs if needed
//-for default behavior: maybe think of each "stack screen" as its own separate navigation, and the tab navigator as a means to get to that navigation.

//todo:
//probably want header and footer to be the aqua color? idk play with it
//dropshadow to topbar and bottombar?
//run expo install for any packages needed to ensure compatability

class App extends Component {
  state = { loading: true, loggedIn: false };

  //for android, because android. prob still janky. with access to manifest file would be easy. figure out later.
  componentDidMount = () => {
    // this.handlePushNotifications();
    this.handleLoginCheck();
  };

  handleLoginCheck = async () => {
    if (await getStoredLogin()) {
      this.setState({ loading: false, loggedIn: true });
    } else {
      this.setState({ loading: false, loggedIn: false });
    }
  };

  handleLogout = async () => {
    //delete JWT token, set loggedIn to false,
    try {
      await AsyncStorage.removeItem("@token").then(() => {
        this.handleLoginCheck();
      });
    } catch (error) {
      console.log("Error with logging out: ", error);
      alert("Error with logging out. Please try again later.");
    }
  };

  handlePushNotifications = async () => {
    //check/setup their permissions. this will be something moved to main app component (vs log/reg when separating)
    if (await this.hasNotificationPermission()) {
      //set up notification channel for android
      if (Platform.OS === "android") {
        Notifications.createChannelAndroidAsync("notifications", {
          name: "default",
          sound: true,
          priority: "max",
          vibrate: [0, 250, 250, 250],
        });
      }

      //retrieve the token
      const token = await Notifications.getExpoPushTokenAsync();

      //update the token in db if needed
      let currentUser = await getCurrentUser();

      try {
        const response = await axios.put(`${baseURL}/user/updatePushToken`, {
          phone: currentUser.phone,
          pushToken: token,
        });

        //if updated, update the token stored (JWT)
        if (response.data.success) {
          if (response.data.message === "updated") {
            await updateToken(currentUser.phone);
          }
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.log("Error with updating push token: ", error);
        alert("Error with updating push token. Please try again later.");
      }
    }
  };

  hasNotificationPermission = async () => {
    try {
      if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(
          Permissions.NOTIFICATIONS
        );

        let finalStatus = existingStatus;

        //if perms not granted already, ask for it
        if (finalStatus !== "granted") {
          const { status } = await Permissions.askAsync(
            Permissions.NOTIFICATIONS
          );
          finalStatus = status;
        }

        //if perms are granted already or after asking for them, exit
        if (finalStatus === "granted") {
          return true;
        }

        //if still not granted, they can open up settings for it
        if (finalStatus !== "granted") {
          Alert.alert(
            "Alert",
            "Push notifications are not enabled. Please go to your settings and enable them for Eat Me if you'd like to receive them.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Settings",
                onPress: () =>
                  Platform.OS === "ios"
                    ? Linking.openURL("app-settings:")
                    : Linking.openSettings(),
              },
            ],
            { cancelable: true }
          );
          return false;
        }
      } else {
        alert(
          "Must use physical device for push notifications. Emulators will not work."
        );
        return false;
      }
    } catch (error) {
      console.log("Error with setting up push notifications: ", error);
      alert(
        "Something went wrong with setting up push notifications. Please try again later."
      );
      return false;
    }
  };

  render() {
    console.log("logged in: ", this.state.loggedIn);
    if (this.state.loading) {
      return <AppLoading />;
    }

    if (this.state.loggedIn) {
      return (
        <NavigationContainer>
          <MainApp handleLogout={this.handleLogout} />
        </NavigationContainer>
      );
    }

    return (
      <NavigationContainer>
        <Startup handleLoginCheck={this.handleLoginCheck} />
      </NavigationContainer>
    );
  }
}

export default App;
