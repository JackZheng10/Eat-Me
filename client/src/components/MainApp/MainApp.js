import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Friends, Settings, Sessions, Session } from "./components";

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

const SettingsStackScreen = () => {
  return (
    <SettingsStack.Navigator
      screenOptions={({ route, navigation }) => ({
        // headerShown: false,
        headerTitleAlign: "left",
        headerStyle: { backgroundColor: "#00B2CA" },
        headerTitleStyle: { color: "white" },
      })}
    >
      <SettingsStack.Screen name="Settings" component={Settings} />
      <SettingsStack.Screen name="StackExample" component={ExampleStack} />
    </SettingsStack.Navigator>
  );
};

const MainApp = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case "Friends":
              return <MaterialIcons name="people" size={size} color={color} />;

            case "Sessions":
              return (
                <MaterialCommunityIcons name="food" size={size} color={color} />
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
      <Tab.Screen name="Settings" component={SettingsStackScreen} />
    </Tab.Navigator>
  );
};

export default MainApp;
