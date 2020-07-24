import React, { Component } from "react";
import { Text, View, Button } from "react-native";
import { withNavigation } from "react-navigation";
import MainAppContext from "../../../../contexts/MainAppContext";

class Settings extends Component {
  static contextType = MainAppContext;

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Settings screen</Text>
        <Button
          title="Go to a new stack view"
          onPress={() => this.props.navigation.navigate("StackExample")}
        />
        <View style={{ height: 10 }} />
        <Button title="Dev logout button" onPress={this.context.handleLogout} />
      </View>
    );
  }
}

export default withNavigation(Settings);
