import React, { Component } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import { getCurrentUser } from "../../../../../../../helpers/session";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F1ED",
  },
  scrollContainer: {
    width: "100%",
  },
  inputContainer: {
    width: windowWidth - 50,
    alignItems: "center",
    backgroundColor: "white",
    paddingTop: 25,
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 10,
  },
  containerStyle: {
    width: windowWidth - 150,
  },
  inputContainerStyle: {
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#00B2CA",
    paddingHorizontal: 10,
  },
  inputStyle: {
    marginLeft: 5,
    marginRight: 5,
    color: "black",
  },
  labelStyle: {
    color: "black",
  },
  buttonContainerStyle: {
    width: windowWidth - 250,
    marginBottom: 20,
  },
  buttonContainerStyleReg: {
    width: windowWidth - 250,
  },
  buttonStyle: {
    backgroundColor: "#F79256",
    borderRadius: 40,
  },
});

class Phone extends Component {
  state = { phone: "" };

  componentDidMount = async () => {
    //todo: maybe fetch details on settings page itself for efficiency? since need darkmode anyways and just pass inside with nav.navigate
    let currentUser = await getCurrentUser();

    this.setState({
      phone: currentUser.phone,
      phoneErrorMsg: "",
    });
  };

  handleInputChange = (event, property) => {
    let input = event.nativeEvent.text;
    const phoneRegex = /^[0-9\b]+$/;

    if (input === "" || phoneRegex.test(input)) {
      if (input.length > 10) {
        input = input.substr(0, 10);
      }
      this.setState({ [property]: input });
    }
  };

  handleInputValidation = () => {
    let valid = true;
    let value = this.state.phone;

    if (!value.replace(/\s/g, "").length) {
      this.setState({ phoneErrorMsg: "Please enter a 10-digit phone number." });
      valid = false;
    } else {
      this.setState({ phoneErrorMsg: "" });
    }

    if (value.length < 10) {
      this.setState({
        phoneErrorMsg: "Please enter a 10-digit phone number.",
      });
      valid = false;
    } else {
      this.setState({ phoneErrorMsg: "" });
    }

    return valid;
  };

  handleUpdatePhone = () => {
    if (this.handleInputValidation()) {
      console.log("can update");
      //still need to check for same, duplicate, etc.
    }
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Phone"
            leftIcon={{
              type: "material-community",
              name: "phone",
              color: "#00B2CA",
            }}
            value={this.state.phone}
            errorMessage={this.state.phoneErrorMsg}
            onChange={(event) => {
              this.handleInputChange(event, "phone");
            }}
            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            placeholderTextColor="#00B2CA"
          />
          <Button
            title="Save"
            raised
            onPress={this.handleUpdatePhone}
            containerStyle={styles.buttonContainerStyle}
            buttonStyle={styles.buttonStyle}
          />
        </View>
      </View>
    );
  }
}

export default Phone;
