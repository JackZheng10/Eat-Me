import React, { Component } from "react";
import { Text, View, Platform, Keyboard, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppLoading } from "expo";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Friends, Sessions, Settings, Login, Register } from "./src/components";

//bottom navigator docs: https://reactnavigation.org/docs/bottom-tab-navigator/
//stack navigation docs: https://reactnavigation.org/docs/stack-navigator/#props
//go to (for example) the settings component to see how to add a "stack" which also uses the navigation prop to navigate to another element
//i didnt uninstall any packages, so after refactoring remove any extraneous ones

const FriendsStack = createStackNavigator();
const SessionsStack = createStackNavigator();
const SettingsStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ExampleStack() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Here's an example of how views can "stack"!</Text>
    </View>
  );
}

function FriendsStackScreen() {
  return (
    <FriendsStack.Navigator
      screenOptions={({ route, navigation }) => ({
        // headerShown: false,
        headerTitleAlign: "left",
      })}
    >
      <FriendsStack.Screen name="Friends" component={Friends} />
      <FriendsStack.Screen name="StackExample" component={ExampleStack} />
    </FriendsStack.Navigator>
  );
}

function SessionsStackScreen() {
  return (
    <SessionsStack.Navigator
      screenOptions={({ route, navigation }) => ({
        // headerShown: false,
        headerTitleAlign: "left",
      })}
    >
      <SessionsStack.Screen name="Sessions" component={Sessions} />
    </SessionsStack.Navigator>
  );
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator
      screenOptions={({ route, navigation }) => ({
        // headerShown: false,
        headerTitleAlign: "left",
      })}
    >
      <SettingsStack.Screen name="Settings" component={Settings} />
      <SettingsStack.Screen name="StackExample" component={ExampleStack} />
    </SettingsStack.Navigator>
  );
}

class App extends Component {
  state = { loading: true, keyboardVisible: false };

  //for android, because android. prob still janky. with access to manifest file would be easy. figure out later.
  componentDidMount = () => {
    if (Platform.OS !== "android") {
      return;
    }

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        this.setState({ keyboardVisible: true });
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        this.setState({ keyboardVisible: false });
      }
    );

    //understand better please
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  };

  render() {
    if (!this.state.loading) {
      return (
        <AppLoading
          onFinish={() => this.setState({ loading: false })}
          onError={console.warn}
        />
      );
    } else {
      return (
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

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
                      <MaterialIcons
                        name="settings"
                        size={size}
                        color={color}
                      />
                    );
                }
              },
            })}
            tabBarOptions={{
              activeTintColor: "tomato",
              inactiveTintColor: "gray",
              // keyboardHidesTabBar: true,
              style: this.state.keyboardVisible ? { display: "none" } : {},
            }}
            initialRouteName="Friends"
          >
            <Tab.Screen name="Friends" component={FriendsStackScreen} />
            <Tab.Screen name="Sessions" component={SessionsStackScreen} />
            <Tab.Screen name="Settings" component={SettingsStackScreen} />
            <Tab.Screen name="Login" component={Login} />
            <Tab.Screen name="Register" component={Register} />
          </Tab.Navigator>
        </NavigationContainer>
      );
    }
  }
}

export default App;
