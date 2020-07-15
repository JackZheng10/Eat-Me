import React, { Component } from "react";
import { Text, View, Dimensions, Keyboard, StyleSheet } from "react-native";
import { Overlay, Divider, Button, Input } from "react-native-elements";

/*
Accepted props
Required:
-title (string): title of the alert
-description (bool): whether or not to include a description
-overlayProps (object): props supplied to the RNE overlay, ex: isVisible (REQUIRED), onBackdropPress
-buttons (array of objects): the buttons to render, each object in the array has: label, color, and onPress
-handler to close the dialog (can pass in via button, onBackropPress, etc.)
-input (bool): whether or not to include an input
-showContent (bool): whether or not to render custom content (below input)

Optional:
-inputProps (object, REQUIRED if "input" is true): props supplied to the RNE input, ex: onChange (REQUIRED, passes in an event object to callback), 
value (REQUIRED, controlled value of text in input), placeholder
-content (component): custom content rendered inside
-description (string): description of the alert
*/

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  buttonTitleStyle: {
    fontSize: 15,
    color: "white",
  },
  buttonContainerStyle: {
    marginLeft: 3,
    marginRight: 3,
  },
  title: {
    fontWeight: "bold",
    fontSize: 25,
  },
  mainContainer: {
    width: windowWidth - 80,
    maxHeight: windowHeight - 180,
  },
  description: {
    fontSize: 15,
    marginBottom: 10,
  },
  divider: {
    backgroundColor: "#00B2CA",
    height: 2,
    marginBottom: 5,
  },
  buttonContainer: {
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  inputContainerStyle: {
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#00B2CA",
    paddingLeft: 10,
    paddingRight: 10,
  },
  inputStyle: {
    fontSize: 15,
    marginLeft: 5,
    marginRight: 5,
  },
});

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
          titleStyle={styles.buttonTitleStyle}
          containerStyle={styles.buttonContainerStyle}
          buttonStyle={{ borderRadius: 40, backgroundColor: button.color }}
          onPress={button.onPress}
          key={index}
        />
      );
    });
  };

  render() {
    const {
      overlayProps,
      title,
      description,
      input,
      inputProps,
      showContent,
      content,
    } = this.props;

    return (
      <Overlay
        {...overlayProps}
        animationType="fade"
        width="100%"
        height="100%"
      >
        <View style={styles.mainContainer}>
          <Text style={styles.title}>{title}</Text>
          <Divider style={styles.divider} />
          {description && <Text style={styles.description}>{description}</Text>}
          {input && (
            <Input
              inputStyle={styles.inputStyle}
              inputContainerStyle={styles.inputContainerStyle}
              ref="inputField"
              {...inputProps}
            />
          )}
          {showContent && content}
          <View style={styles.buttonContainer}>{this.renderButtons()}</View>
        </View>
      </Overlay>
    );
  }
}

export default DialogBox;
