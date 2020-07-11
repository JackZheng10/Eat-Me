import React, { Component } from "react";
import { Text, View, Dimensions, Keyboard } from "react-native";
import { Overlay, Divider, Button, Input } from "react-native-elements";

/*
Accepted props
Required:
-title (string): title of the alert
-description (string): description of the alert
-overlayProps (object): props supplied to the RNE overlay, ex: isVisible (REQUIRED), onBackdropPress
-buttons (array of objects): the buttons to render, each object in the array has: label, color, and onPress
-handler to close the dialog (can pass in via button, onBackropPress, etc.)
-input (bool): whether or not to include an input

Optional:
-inputProps (object, REQUIRED if "input" is true): props supplied to the RNE input, ex: onChange (REQUIRED, passes in an event object to callback), 
value (REQUIRED, controlled value of text in input) placeholder
*/

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

class DialogBox extends Component {
  componentDidMount() {
    //for android since inputs are still focused when exiting keyboard. prob. a better workaround somewhere
    Keyboard.addListener("keyboardDidHide", this.unfocusInputs);
  }

  unfocusInputs = () => {
    if (this.refs["inputField"]) {
      this.refs["inputField"].blur();
    }
  };

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
    const { overlayProps, title, description, input, inputProps } = this.props;

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
          <Text style={{ fontSize: 15, marginBottom: 10 }}>{description}</Text>
          {input && (
            <Input
              inputStyle={{ fontSize: 15, marginLeft: 5, marginRight: 5 }}
              inputContainerStyle={{
                borderRadius: 40,
                borderWidth: 1,
                borderColor: "#00B2CA",
                paddingLeft: 10,
                paddingRight: 10,
              }}
              ref="inputField"
              {...inputProps}
            />
          )}
          <View style={{ justifyContent: "flex-end", flexDirection: "row" }}>
            {this.renderButtons()}
          </View>
        </View>
      </Overlay>
    );
  }
}

export default DialogBox;
