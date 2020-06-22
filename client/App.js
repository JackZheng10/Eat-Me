import React, { Component } from "react";
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon, //
  Text,
} from "native-base";
import { ActivityIndicator } from "react-native";
import * as Font from "expo-font";
//import { NavigationContainer } from '@react-navigation/native';
import Friends from "./src/components/Friends";
import Sessions from "./src/components/Sessions";
import Settings from "./src/components/Settings";
import Login from "./src/components/Login";
import Register from "./src/components/Register";

class App extends Component {
  state = {
    currentView: "register",
    loading: true,
  };

  //needed on android sorry
  componentDidMount = async () => {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    });
    this.setState({ loading: false });
  };

  //Need to organize this class much better
  renderView = () => {
    switch (this.state.currentView) {
      case "register":
        return <Register />;
      case "login":
        return <Login />;
      case "sessions":
        return <Sessions />;
      case "friends":
        return <Friends />;
      case "settings":
        return <Settings />;
    }
  };

  handleSetView = (view) => {
    this.setState({ currentView: view });
  };

  handleActive = (view) => {
    return this.state.currentView === view;
  };

  render() {
    if (this.state.loading) {
      return (
        <Container>
          <ActivityIndicator />
        </Container>
      );
    } else {
      return (
        <Container>
          <Header />
          {this.renderView()}
          <Footer>
            <FooterTab>
              <Button
                active={this.handleActive("friends")}
                onPress={() => this.handleSetView("friends")}
              >
                <Icon name="person" />
              </Button>
              <Button
                active={this.handleActive("sessions")}
                onPress={() => this.handleSetView("sessions")}
              >
                <Icon name="pie" />
              </Button>
              <Button
                active={this.handleActive("settings")}
                onPress={() => this.handleSetView("settings")}
              >
                <Icon name="settings" />
              </Button>
              <Button
                active={this.handleActive("login")}
                onPress={() => this.handleSetView("login")}
              >
                <Icon name="log-in" />
              </Button>
              <Button
                active={this.handleActive("register")}
                onPress={() => this.handleSetView("register")}
              >
                <Icon name="paper" />
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      );
    }
  }
}

export default App;
