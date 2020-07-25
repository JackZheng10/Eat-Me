import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Switch,
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
});

const dummySettings = [
  { name: "General", config: "screen" },
  { name: "Account", config: "screen" },
  { name: "Dark Mode", config: "switch" },
];

class Settings extends Component {
  static contextType = MainAppContext;

  renderIcon = (config) => {
    return config === "screen" ? (
      <Icon name="angle-right" type="font-awesome" color="#F79256" size={25} />
    ) : (
      <Switch />
    );
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
