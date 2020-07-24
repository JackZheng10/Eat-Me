import React, { Component } from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Friends, Settings, Sessions, Session } from "./components";
import {
  getCurrentUser,
  updateToken,
  getStoredLogin,
} from "../../helpers/session";
import { Notifications } from "expo";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import axios from "axios";
import baseURL from "../../../baseURL";

const FriendsStack = createStackNavigator();
const SessionsStack = createStackNavigator();
const SettingsStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ExampleStack = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Here's an example of how views can "stack"!</Text>
    </View>
  );
};

const FriendsStackScreen = () => {
  return (
    <FriendsStack.Navigator
      screenOptions={({ route, navigation }) => ({
        headerTitleAlign: "left",
        headerStyle: { backgroundColor: "#00B2CA" },
        headerTitleStyle: { color: "white" },
      })}
    >
      <FriendsStack.Screen name="Friends" component={Friends} />
      <FriendsStack.Screen name="StackExample" component={ExampleStack} />
    </FriendsStack.Navigator>
  );
};

const SessionsStackScreen = () => {
  return (
    <SessionsStack.Navigator
      screenOptions={({ route, navigation }) => ({
        // headerShown: false,
        headerTitleAlign: "left",
        headerStyle: { backgroundColor: "#00B2CA" },
        headerTitleStyle: { color: "white" },
      })}
    >
      <SessionsStack.Screen name="Sessions" component={Sessions} />
      <SessionsStack.Screen name="Session" component={Session} />
    </SessionsStack.Navigator>
  );
};

//todo: this should be pure component since it's getting prop passed in
const SettingsStackScreen = (props) => {
  const { handleLogout } = props;

  return (
    <SettingsStack.Navigator
      screenOptions={({ route, navigation }) => ({
        // headerShown: false,
        headerTitleAlign: "left",
        headerStyle: { backgroundColor: "#00B2CA" },
        headerTitleStyle: { color: "white" },
      })}
    >
      <Tab.Screen name="Settings">
        {(props) => <Settings {...props} handleLogout={handleLogout} />}
      </Tab.Screen>
      <SettingsStack.Screen name="StackExample" component={ExampleStack} />
    </SettingsStack.Navigator>
  );
};

class MainApp extends Component {
  componentDidMount = () => {
    this.handlePushNotifications();
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
      console.log("Expo push token (should not be null/undefined): ", token);

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
        console.warn(
          "Warning: Must use physical device for push notifications. Emulators will not work."
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
    const { handleLogout } = this.props;

    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            switch (route.name) {
              case "Friends":
                return (
                  <MaterialIcons name="people" size={size} color={color} />
                );

              case "Sessions":
                return (
                  <MaterialCommunityIcons
                    name="food"
                    size={size}
                    color={color}
                  />
                );

              case "Settings":
                return (
                  <MaterialIcons name="settings" size={size} color={color} />
                );
            }
          },
        })}
        tabBarOptions={{
          activeTintColor: "#F5F1ED",
          inactiveTintColor: "#848482",
          keyboardHidesTabBar: true,
          style: { backgroundColor: "#00B2CA" },
        }}
        initialRouteName="Friends" //until sessions ui is fixed
        lazy={false} //all tabs rendered on initial app load, but maybe not their stack views. if this is too slow, think of a workaround
      >
        <Tab.Screen name="Friends" component={FriendsStackScreen} />
        <Tab.Screen name="Sessions" component={SessionsStackScreen} />
        <Tab.Screen name="Settings">
          {(props) => (
            <SettingsStackScreen {...props} handleLogout={handleLogout} />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    );
  }
}

export default MainApp;
