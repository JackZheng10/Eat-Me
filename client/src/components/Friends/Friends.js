import React, { Component } from "react";
import { Text, View, Button } from "react-native";
import { withNavigation } from "react-navigation";

class Friends extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Friends screen</Text>
        <Button
          title="Go to a new stack view"
          onPress={() => this.props.navigation.navigate("StackExample")}
        />
      </View>
    );
  }
}

export default withNavigation(Friends);
