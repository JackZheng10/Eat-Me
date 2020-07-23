import React, { Component } from "react";
import { Modal } from "react-native";
import Categories from "./components/Categories";
import Location from "./components/Location";
import SessionSave from "./components/SessionSave";
import SelectFriends from "./components/SelectFriends";
import baseURL from "../../../../../../../baseURL";
import { getCurrentUser } from "../../../../../../helpers/session";
import axios from "axios";
import { createStackNavigator } from "@react-navigation/stack";

const CreateSessionStack = createStackNavigator();

class CreateSession extends Component {
  state = {
    sessionLevel: 0,
    sessionConfigurables: {
      sessionCategories: [],
      sessionLocation: {
        latitude: 0,
        longitude: 0,
      },
      sessionFriends: [],
    },
    navigation: null,
  };

  componentDidMount = () => {};

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (prevState.sessionLevel != this.state.sessionLevel) {
      this.renderSessionConfigurables();
    }
  };

  renderStackNavigation = () => {
    return (
      <CreateSessionStack.Navigator initialRouteName="Categories">
        <CreateSessionStack.Screen
          name="Categories"
          component={this.renderCategories}
        />
        <CreateSessionStack.Screen
          name="Location"
          component={this.renderLocation}
        />
        <CreateSessionStack.Screen
          name="Friends"
          component={this.renderFriends}
        />
        <CreateSessionStack.Screen
          name="Save"
          component={this.renderSessionSave}
        />
      </CreateSessionStack.Navigator>
    );
  };

  renderSessionConfigurables = () => {
    const { sessionLevel } = this.state;

    if (sessionLevel === 0) {
      this.navigation.navigate("Categories");
    } else if (sessionLevel === 1) {
      this.navigation.navigate("Location");
    } else if (sessionLevel === 2) {
      this.navigation.navigate("Friends");
    } else {
      this.navigation.navigate("Save");
    }
  };

  renderCategories = ({ navigation }) => {
    //HACK - Since first Screen in Modal Stack is Categories, this is where we grap a reference to our navigation object
    this.navigation = navigation;

    return (
      <Categories
        updateSessionConfigurable={this.updateSessionConfigurable}
        goBack={this.renderPreviousSessionLevel}
        exit={this.onModalClose}
        selectedCategories={this.state.sessionConfigurables.sessionCategories}
      />
    );
  };

  renderLocation = () => {
    return (
      <Location
        updateSessionConfigurable={this.updateSessionConfigurable}
        goBack={this.renderPreviousSessionLevel}
        exit={this.onModalClose}
        selectedLocation={this.state.sessionConfigurables.sessionLocation}
      />
    );
  };

  renderFriends = () => {
    return (
      <SelectFriends
        updateSessionConfigurable={this.updateSessionConfigurable}
        goBack={this.renderPreviousSessionLevel}
        exit={this.onModalClose}
        selectedFriends={this.state.sessionConfigurables.sessionFriends}
      />
    );
  };

  //Update View
  renderSessionSave = () => {
    const { sessionConfigurables } = this.state;

    return (
      <SessionSave
        createSession={this.createSession}
        goBack={this.renderPreviousSessionLevel}
        exit={this.onModalClose}
        sessionConfigurables={sessionConfigurables}
      />
    );
  };

  //Needs Refactor to use use functions like getCurrentUser+ from helper files
  createSession = async () => {
    let currentUser = await getCurrentUser();

    const { sessionConfigurables } = this.state;

    const newSession = await axios.post(baseURL + "/user/createSession", {
      sessionConfigurables,
      currentUser,
    });

    this.props.addSession(newSession.data);
    this.onModalClose();
  };

  updateSessionConfigurable = (sessionConfigurable) => {
    let { sessionConfigurables, sessionLevel } = this.state;
    if (sessionLevel === 0) {
      sessionConfigurables.sessionCategories = sessionConfigurable;
    } else if (sessionLevel === 1) {
      sessionConfigurables.sessionLocation = sessionConfigurable;
    } else if (sessionLevel === 2) {
      sessionConfigurables.sessionFriends = sessionConfigurable;
    }

    this.setState({
      sessionLevel: this.state.sessionLevel + 1,
      sessionConfigurables,
    });
  };

  renderPreviousSessionLevel = () => {
    const { sessionLevel } = this.state;
    if (sessionLevel - 1 >= 0) {
      this.setState({
        sessionLevel: sessionLevel - 1,
      });
    } else {
      this.onModalClose();
    }
  };

  onModalClose = () => {
    this.props.exitModal();
  };

  render() {
    const { modalVisible } = this.props;
    return (
      <Modal
        animationType="fade"
        // transparent="true"
        visible={modalVisible}
        onRequestClose={this.onModalClose}
      >
        {this.renderStackNavigation()}
      </Modal>
    );
  }
}

export default CreateSession;
