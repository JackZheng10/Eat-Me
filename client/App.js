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
import { MainApp, Startup } from "./src/components";
import {
  getCurrentUser,
  updateToken,
  getStoredLogin,
} from "./src/helpers/session";
import { MainAppContext, StartupContext } from "./src/contexts";

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
//loading/progress bar for processes like loading here, except replaced with something else not the splash screen. good for screens that need to load data under componentdidmount

class App extends Component {
  state = { loading: true, loggedIn: false };

  componentDidMount = () => {
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

  render() {
    if (this.state.loading) {
      return <AppLoading />;
    }

    if (this.state.loggedIn) {
      return (
        <NavigationContainer>
          <MainAppContext.Provider
            value={{
              handleLogout: this.handleLogout,
            }}
          >
            <MainApp />
          </MainAppContext.Provider>
        </NavigationContainer>
      );
    }

    return (
      <NavigationContainer>
        <StartupContext.Provider
          value={{ handleLoginCheck: this.handleLoginCheck }}
        >
          <Startup />
        </StartupContext.Provider>
      </NavigationContainer>
    );
  }
}

export default App;
