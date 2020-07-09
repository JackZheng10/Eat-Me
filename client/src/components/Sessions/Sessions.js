import React, { Component } from "react";
import { Text, View, Button } from "react-native";
import { withNavigation } from "react-navigation";

class Sessions extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Sessions screen</Text>
      </View>
    );
  }
}

export default withNavigation(Sessions);
