import React, { Component } from "react";
import { View } from "react-native";
import { Button } from "react-native-elements";
import { ModalStyles } from "./styles";

class CreateSessionFooter extends Component {
  render() {
    return (
      <View style={ModalStyles.footer}>
        <Button
          onPress={this.props.updateSession}
          buttonStyle={ModalStyles.updateSessionButton}
          title={this.props.title}
        />
      </View>
    );
  }
}

export default CreateSessionFooter;
