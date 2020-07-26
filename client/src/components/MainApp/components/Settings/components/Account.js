import React, { Component } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { ListItem, Icon, Button } from "react-native-elements";
import { getCurrentUser } from "../../../../../helpers/session";

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5F1ED",
  },
  scrollContainer: {
    width: "100%",
  },
  settingsContainerStyle: {
    backgroundColor: "#F5F1ED",
  },
  accountInfoTitle: {
    color: "#F79256",
    fontWeight: "bold",
    fontSize: 18,
  },
  accountInfoSubtitle: {
    // fontWeight: "bold",
    color: "black",
    fontSize: 15,
  },
});

class Account extends Component {
  state = {
    accountInfo: [
      { name: "Name", value: "" },
      { name: "Phone", value: "" },
      { name: "Password", value: "Hidden" },
    ],
  };

  componentDidMount = async () => {
    let currentUser = await getCurrentUser();

    this.setState({
      accountInfo: [
        { name: "Name", value: `${currentUser.fName} ${currentUser.lName}` },
        { name: "Phone", value: `${currentUser.phone}` },
        { name: "Password", value: "*Hidden*" },
      ],
    });
  };

  renderRightIcon = () => {
    return (
      <Icon name="angle-right" type="font-awesome" color="#F79256" size={35} />
    );
  };

  renderLeftIcon = (name) => {
    switch (name) {
      case "Name":
        return (
          <Icon
            name="account"
            type="material-community"
            color="#00B2CA"
            size={35}
          />
        );

      case "Phone":
        return (
          <Icon
            name="phone"
            type="material-community"
            color="#00B2CA"
            size={35}
          />
        );

      case "Password":
        return <Icon name="lock" type="material" color="#00B2CA" size={35} />;
    }
  };

  renderAccountInfo = () => {
    return this.state.accountInfo.map((property, index) => {
      return (
        <ListItem
          key={index}
          title={property.name}
          subtitle={property.value}
          bottomDivider
          containerStyle={styles.settingsContainerStyle}
          titleProps={{ style: styles.accountInfoTitle }}
          subtitleProps={{ style: styles.accountInfoSubtitle }}
          rightIcon={this.renderRightIcon()}
          leftIcon={this.renderLeftIcon(property.name)}
          // onPress={this.handleOnPress(setting.config, setting.name)}
        />
      );
    });
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.scrollContainer}>
          {this.renderAccountInfo()}
        </ScrollView>
      </View>
    );
  }
}

export default Account;
