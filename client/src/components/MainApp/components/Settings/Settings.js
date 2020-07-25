import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Switch,
  Platform,
} from "react-native";
import { ListItem, Icon, Button } from "react-native-elements";
import { withNavigation } from "react-navigation";
import Constants from "expo-constants";
import MainAppContext from "../../../../contexts/MainAppContext";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5F1ED",
  },
  scrollContainer: {
    width: "100%",
  },
  logoutButtonContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  settingsContainerStyle: {
    backgroundColor: "#F5F1ED",
    height: 55,
  },
  buttonContainerStyle: {
    width: windowWidth - 250,
  },
  buttonStyle: {
    backgroundColor: "#F79256",
    borderRadius: 40,
  },
  switchEnableBorder: {
    borderColor: "#8ED5F5",
    borderWidth: 1,
  },
  switchDisableBorder: {
    borderColor: "#D3D3D3",
    borderWidth: 1,
  },
});

const dummySettings = [
  { name: "General", config: "screen" },
  { name: "Account", config: "screen" },
  { name: "Dark Mode", config: "switch" },
];

//todo: play w height of settingsContainerStyle, base it off of windowheight? depends how the other lists show..

class Settings extends Component {
  static contextType = MainAppContext;

  state = { darkMode: false };

  renderIcon = (config) => {
    return config === "screen" ? (
      <Icon name="angle-right" type="font-awesome" color="#F79256" size={25} />
    ) : (
      <Switch
        onValueChange={this.toggleDarkMode}
        value={this.state.darkMode}
        trackColor={{
          true: "#8ED5F5",
          false: "#D3D3D3",
        }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#FBFBFB"
        style={
          Platform.OS === "ios"
            ? this.state.darkMode
              ? styles.switchEnableBorder
              : styles.switchDisableBorder
            : {}
        }
      />
    );
  };

  toggleDarkMode = () => {
    this.setState({ darkMode: !this.state.darkMode });
  };

  handleOnPress = (config, name) => {
    return config === "screen"
      ? () => {
          this.props.navigation.navigate(name);
        }
      : null;
  };

  renderSettingsList = () => {
    return dummySettings.map((setting, index) => {
      return (
        <ListItem
          key={index}
          title={setting.name}
          bottomDivider
          containerStyle={styles.settingsContainerStyle}
          titleProps={{ style: { color: "#F79256" } }}
          rightIcon={this.renderIcon(setting.config)}
          onPress={this.handleOnPress(setting.config, setting.name)}
        />
      );
    });
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.scrollContainer}>
          {this.renderSettingsList()}
          <View style={styles.logoutButtonContainer}>
            <Button
              title="Log Out"
              raised
              onPress={this.context.handleLogout}
              containerStyle={styles.buttonContainerStyle}
              buttonStyle={styles.buttonStyle}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default withNavigation(Settings);
