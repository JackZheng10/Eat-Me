import React, { Component } from "react";
import Dialog from "react-native-dialog";

//custom-made dialog component leveraged for better reusage from react-native-dialog
//courtesy of jack ty, might change due to janky fade out on android
//todo: make configurations for standard dialog (no input, only title + desc + OK) and custom dialog (buttons, input, etc.)

/*
Props:
-visible (bool): whether or not the dialog is visible
-title (string): title of the dialog
-description (string): the dialog's description/text
-input (bool): whether or not an input is present
-onInputChange (function): called whenever the input is changed, called with a parameter of the current input (string)
-inputProps (object): props supplied to the input component (if present)
-buttons (array of objects): the buttons to render, each object in the array has the button name, color
*/

class DialogBox extends Component {
  handleInputChange = (event) => {
    this.props.onInputChange(event.nativeEvent.text);
  };

  renderButtons = () => {
    return this.props.buttons.map((button, index) => {
      return (
        <Dialog.Button
          label={button.label}
          color={button.color}
          key={index}
          onPress={button.onPress}
        />
      );
    });
  };

  render() {
    const { visible, title, description, input, inputProps } = this.props;

    return (
      <Dialog.Container visible={visible} useNativeDriver={true}>
        <Dialog.Title style={{ fontWeight: "bold" }}>{title}</Dialog.Title>
        {input && (
          <Dialog.Input {...inputProps} onChange={this.handleInputChange} />
        )}
        <Dialog.Description>{description}</Dialog.Description>
        {this.renderButtons()}
      </Dialog.Container>
    );
  }
}

export default DialogBox;
