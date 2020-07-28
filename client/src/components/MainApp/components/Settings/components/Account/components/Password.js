import React, { Component } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import {
  getCurrentUser,
  updateToken,
} from "../../../../../../../helpers/session";
import axios from "axios";
import baseURL from "../../../../../../../../baseURL";

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

class Password extends Component {
  state = {
    password: "",
    passwordConfirm: "",
    passwordErrorMsg: "",
    passwordConfirmErrorMsg: "",
  };

  handleInputChange = (event, property) => {
    let input = event.nativeEvent.text;
    this.setState({ [property]: input });
  };

  handleInputValidation = () => {
    let valid = true;

    const inputs = [
      {
        name: "password",
        whitespaceMsg: "Please enter a password.",
      },
      {
        name: "passwordConfirm",
        whitespaceMsg: "Please confirm your password.",
      },
    ];

    for (let input of inputs) {
      let value = this.state[input.name];

      //whitespace checks
      if (!value.replace(/\s/g, "").length) {
        this.setState({ [input.name + "ErrorMsg"]: input.whitespaceMsg });
        valid = false;
        continue;
      } else {
        this.setState({ [input.name + "ErrorMsg"]: "" });
      }

      switch (input.name) {
        case "password":
          if (
            value.length < 6 ||
            /[A-Z]+/.test(value) === false ||
            /[\s~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?()\._]/g.test(value) ===
              false
          ) {
            this.setState({
              [input.name +
              "ErrorMsg"]: "Passwords must be at least 6 characters long, contain one capital letter, and contain one special character.",
            });
            valid = false;
          } else {
            this.setState({
              [input.name + "ErrorMsg"]: "",
            });
          }
          break;

        case "passwordConfirm":
          if (value !== this.state.password) {
            this.setState({
              [input.name + "ErrorMsg"]: "Passwords must match.",
            });
            valid = false;
          } else {
            this.setState({
              [input.name + "ErrorMsg"]: "",
            });
          }
          break;
      }
    }

    return valid;
  };

  handleUpdatePassword = async () => {
    if (this.handleInputValidation()) {
      let currentUser = await getCurrentUser();
      try {
        const response = await axios.put(`${baseURL}/user/updatePassword`, {
          phone: currentUser.phone,
          newPassword: this.state.password,
        });

        if (response.data.success) {
          await updateToken(currentUser.phone);
          this.clearInputs();
        }

        alert(response.data.message);
      } catch (error) {
        console.log("Error with updating password: ", error);
        alert("Error with updating password. Please try again later.");
      }
    }
  };

  clearInputs = () => {
    this.setState({ password: "", passwordConfirm: "" });
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.inputContainer}>
          <Input
            placeholder="New Password"
            leftIcon={{
              type: "material",
              name: "lock",
              color: "#00B2CA",
            }}
            onChange={(event) => {
              this.handleInputChange(event, "password");
            }}
            errorMessage={this.state.passwordErrorMsg}
            value={this.state.password}
            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            placeholderTextColor="#00B2CA"
            secureTextEntry
          />
          <Input
            placeholder="Confirm Password"
            leftIcon={{
              type: "material",
              name: "lock",
              color: "#00B2CA",
            }}
            onChange={(event) => {
              this.handleInputChange(event, "passwordConfirm");
            }}
            value={this.state.passwordConfirm}
            errorMessage={this.state.passwordConfirmErrorMsg}
            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            placeholderTextColor="#00B2CA"
            secureTextEntry
          />
          <Button
            title="Save"
            raised
            onPress={this.handleUpdatePassword}
            containerStyle={styles.buttonContainerStyle}
            buttonStyle={styles.buttonStyle}
          />
        </View>
      </View>
    );
  }
}

export default Password;
