import React, { Component } from "react";
import { Text, View, Button } from "react-native";
import { withNavigation } from "react-navigation";

class Register extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Register</Text>
      </View>
    );
  }
}

export default withNavigation(Register);
