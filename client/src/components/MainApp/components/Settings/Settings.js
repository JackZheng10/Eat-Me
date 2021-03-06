import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Switch,
  Platform,
  Linking,
} from "react-native";
import { ListItem, Icon, Button } from "react-native-elements";
import { withNavigation } from "react-navigation";
import { DialogBox } from "../../../utility";
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
  buttonContainer: {
    alignItems: "center",
  },
  settingsContainerStyle: {
    backgroundColor: "#F5F1ED",
    height: 55,
  },
  buttonContainerStyleUpper: {
    width: windowWidth - 250,
    marginVertical: 20,
  },
  buttonContainerStyleLower: {
    width: windowWidth - 250,
    marginBottom: 20,
  },
  buttonContainerStyleAlone: {
    width: windowWidth - 180,
    marginVertical: 10,
  },
  buttonStyle: {
    backgroundColor: "#F79256",
    borderRadius: 40,
  },
  buttonStyleGH: {
    backgroundColor: "#8ED5F5",
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
  settingsTitle: {
    color: "#F79256",
    fontWeight: "bold",
  },
});

const settingsList = [
  { name: "General", config: "screen" },
  { name: "Account", config: "screen" },
  { name: "Dark Mode", config: "switch" },
];

//todo: play w height of settingsContainerStyle, base it off of windowheight? depends how the other lists show..
//todo: when i fixed paddingbottom of login/register, use that for the other pages too? for ex: maincontainer here..depends what it looks like when full page taken up by scroll
//todo: standardize the button spacing (2 buttons here vs 2 buttons in register, for example)
//todo: localstorage for darkmode? probably faster than making a network request to handle it.

class Settings extends Component {
  static contextType = MainAppContext;

  state = { darkMode: false, showContactDialog: false };

  //todo: test switch look on ios
  renderRightIcon = (config) => {
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
        ios_backgroundColor="#D3D3D3"
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

  renderLeftIcon = (name) => {
    switch (name) {
      case "General":
        return (
          <Icon name="settings" type="material" color="#00B2CA" size={25} />
        );

      case "Account":
        return (
          <Icon
            name="account-circle"
            type="material"
            color="#00B2CA"
            size={25}
          />
        );

      case "Dark Mode":
        return (
          <Icon name="wb-sunny" type="material" color="#00B2CA" size={25} />
        );
    }
  };

  toggleDarkMode = () => {
    this.setState({ darkMode: !this.state.darkMode });
  };

  toggleContactDialog = () => {
    this.setState({ showContactDialog: !this.state.showContactDialog });
  };

  handleOnPress = (name) => {
    this.props.navigation.navigate(name);
  };

  //todo: why does changing the onpress to an arrow function calling it make it not work?? whereas doing it in account works??
  //^^ it was because one of the handlers returned a function (settings). in onpress: call a function (brackets) or return a function to be called (function reference, or () => function which is an implicit return arrow function)
  //https://stackoverflow.com/questions/39629962/arrow-function-without-curly-braces ?

  renderSettingsList = () => {
    return settingsList.map((setting, index) => {
      return (
        <ListItem
          key={index}
          title={setting.name}
          bottomDivider
          containerStyle={styles.settingsContainerStyle}
          titleProps={{ style: styles.settingsTitle }}
          rightIcon={this.renderRightIcon(setting.config)}
          leftIcon={this.renderLeftIcon(setting.name)}
          onPress={
            setting.config === "screen"
              ? () => {
                  this.handleOnPress(setting.name);
                }
              : null
          }
        />
      );
    });
  };

  renderContactInfo = () => {
    return (
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 15, fontWeight: "bold", textAlign: "center" }}>
          Have questions or need to report a bug?
        </Text>
        <Text style={{ fontSize: 15, marginTop: 10, textAlign: "center" }}>
          Send us an email at:
        </Text>
        <Text style={{ fontSize: 15, marginBottom: 10, textAlign: "center" }}>
          placeholder@placeholder.com
        </Text>
        <Text style={{ fontSize: 15, textAlign: "center" }}>or</Text>
        <Button
          title="Submit an issue on GitHub"
          raised
          onPress={() => {
            Linking.openURL("https://github.com/JackZheng10/Eat-Me").catch(
              (error) => {
                console.log("Error with opening page: ", error);
                alert("Error with opening page. Please try again later.");
              }
            );
            this.toggleContactDialog();
          }}
          containerStyle={styles.buttonContainerStyleAlone}
          buttonStyle={styles.buttonStyleGH}
        />
      </View>
    );
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <DialogBox
          overlayProps={{
            isVisible: this.state.showContactDialog,
            onBackdropPress: this.toggleContactDialog,
          }}
          buttons={[
            {
              label: "Close",
              color: "#F75555",
              onPress: this.toggleContactDialog,
            },
          ]}
          input={false}
          description={false}
          showContent={true}
          content={this.renderContactInfo()}
          title="Contact Us"
        />
        <ScrollView style={styles.scrollContainer}>
          {this.renderSettingsList()}
          <View style={styles.buttonContainer}>
            <Button
              title="Contact Us"
              raised
              onPress={this.toggleContactDialog}
              containerStyle={styles.buttonContainerStyleUpper}
              buttonStyle={styles.buttonStyle}
            />
            <Button
              title="Log Out"
              raised
              onPress={this.context.handleLogout}
              containerStyle={styles.buttonContainerStyleLower}
              buttonStyle={styles.buttonStyle}
            />
            <Text>Eat Me v1.0</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default withNavigation(Settings);
