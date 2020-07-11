import React, { Component } from "react";
import { Text, View, Dimensions } from "react-native";
import { Overlay, Divider, Button } from "react-native-elements";

/*
Accepted props
-title (string): title of the alert
-description (string): description of the alert
-overlayProps (object): props supplied to the RNE overlay, ex: isVisible, onBackdropPress
-buttons (array of objects): the buttons to render, each object in the array has: label, color, and onPress
*/

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

class DialogBox extends Component {
  renderButtons = () => {
    return this.props.buttons.map((button, index) => {
      return (
        <Button
          title={button.label}
          raised
          titleStyle={{ fontSize: 15, color: "white" }}
          containerStyle={{
            marginLeft: 3,
            marginRight: 3,
          }}
          buttonStyle={{
            backgroundColor: button.color,
            borderRadius: 40,
          }}
          onPress={button.onPress}
          key={index}
        />
      );
    });
  };

  render() {
    const { overlayProps, title, description } = this.props;

    return (
      <Overlay
        {...overlayProps}
        transparent={true}
        animationType="fade"
        width="100%"
        height="100%"
      >
        <View style={{ width: windowWidth - 80 }}>
          <Text style={{ fontWeight: "bold", fontSize: 25 }}>{title}</Text>
          <Divider
            style={{
              backgroundColor: "#00B2CA",
              height: 2,
              marginBottom: 5,
            }}
          />
          <Text style={{ fontSize: 15, marginBottom: 5 }}>{description}</Text>
          <View style={{ justifyContent: "flex-end", flexDirection: "row" }}>
            {this.renderButtons()}
          </View>
        </View>
      </Overlay>
    );
  }
}

export default DialogBox;
