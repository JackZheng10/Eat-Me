import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  Keyboard,
  Alert,
} from "react-native";
import { Input, Button, Overlay } from "react-native-elements";
import { Col, Row, Grid } from "react-native-easy-grid";
import { withNavigation } from "react-navigation";
import { DialogBox } from "../../utility";
import Constants from "expo-constants";
import axios from "axios";
import Logo from "../../../images/Logo.png";
import baseURL from "../../../../baseURL";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    paddingBottom: Constants.statusBarHeight,
    backgroundColor: "#F5F1ED",
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
  inlineContainer: {
    flexDirection: "row",
  },
  containerStyle: {
    width: windowWidth - 150,
  },
  containerStyleName: {
    width: windowWidth - 240,
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
  logoContainer: {
    width: windowWidth,
    margin: windowWidth - 650,
  },
  logo: {
    resizeMode: "contain",
    width: windowWidth,
  },
  regText: {
    marginTop: 20,
  },
  header: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#00B2CA",
  },
});

//todo: limit password to certain length

class Register extends Component {
  state = {
    fName: "",
    lName: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    fNameErrorMsg: "",
    lNameErrorMsg: "",
    phoneErrorMsg: "",
    passwordErrorMsg: "",
    passwordConfirmErrorMsg: "",
    showVerifyDialog: false,
    generatedCode: "N/A",
    enteredCode: "",
  };

  componentDidMount() {
    //for android since inputs are still focused when exiting keyboard. prob. a better workaround somewhere
    Keyboard.addListener("keyboardDidHide", this.unfocusInputs);
  }

  unfocusInputs = () => {
    const inputs = ["fName", "lName", "phone", "password", "passwordConfirm"];

    inputs.forEach((input) => {
      if (this.refs[input]) {
        this.refs[input].blur();
      }
    });
  };

  handleInputChange = (event, property) => {
    let input = event.nativeEvent.text;
    const nameRegex = /^[a-zA-Z][a-zA-Z\s]*$/;
    const phoneRegex = /^[0-9\b]+$/;

    switch (property) {
      case "fName":
        if (input === "" || nameRegex.test(input)) {
          this.setState({ [property]: input });
        }
        break;

      case "lName":
        if (input === "" || nameRegex.test(input)) {
          this.setState({ [property]: input });
        }
        break;

      case "phone":
        if (input === "" || phoneRegex.test(input)) {
          if (input.length > 10) {
            input = input.substr(0, 10);
          }
          this.setState({ [property]: input });
        }
        break;

      case "password":
        this.setState({ [property]: input });
        break;

      case "passwordConfirm":
        this.setState({ [property]: input });
        break;
    }
  };

  handleInputValidation = () => {
    //todo: maybe support more than 10-digit phone #, see how twilio handles that
    let valid = true;

    const inputs = [
      {
        name: "fName",
        whitespaceMsg: "Please enter a first name.",
      },
      {
        name: "lName",
        whitespaceMsg: "Please enter a last name.",
      },
      {
        name: "phone",
        whitespaceMsg: "Please enter a 10-digit phone number.",
      },
      {
        name: "password",
        whitespaceMsg: "Please enter a password.",
      },
      {
        name: "passwordConfirm",
        whitespaceMsg: "Please confirm your password.",
      },
    ];

    for (let x = 0; x < inputs.length; x++) {
      let input = inputs[x];
      let value = this.state[input.name];

      //whitespace checks
      if (!value.replace(/\s/g, "").length) {
        this.setState({ [input.name + "ErrorMsg"]: input.whitespaceMsg });
        valid = false;
        continue;
      } else {
        this.setState({ [input.name + "ErrorMsg"]: "" });
      }

      //input-specific checks
      switch (input.name) {
        case "phone":
          if (value.length < 10) {
            this.setState({
              [input.name +
              "ErrorMsg"]: "Please enter a 10-digit phone number.",
            });
            valid = false;
          } else {
            this.setState({ [input.name + "ErrorMsg"]: "" });
          }
          break;

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

  handleVerification = async () => {
    //make sure all inputs are valid
    if (this.handleInputValidation()) {
      //check if phone number is already in use
      try {
        const response = await axios.get(
          `${baseURL}/user/checkDuplicatePhone`,
          {
            params: {
              phone: this.state.phone,
            },
          }
        );

        if (response.data.success) {
          //send verification code and open up verification prompt
          try {
            const response = await axios.post(`${baseURL}/twilio/verify`, {
              to: this.state.phone,
            });

            if (response.data.success) {
              this.setState({ generatedCode: response.data.message }, () => {
                this.toggleVerifyDialog();
              });
            } else {
              alert(response.data.message);
            }
          } catch (error) {
            console.log("Error with sending verification code: ", error);
            alert("Error with sending verification code. Please try again.");
          }
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.log("Error with checking duplicate phone number: ", error);
        alert("Error with checking duplicate phone number. Please try again.");
      }
    }
  };

  handleRegistration = async () => {
    if (this.state.generatedCode === this.state.enteredCode) {
      const { fName, lName, phone, password } = this.state;

      try {
        const response = await axios.post(`${baseURL}/user/register`, {
          fName,
          lName,
          phone,
          password,
        });

        //handle res.data.success stuff
        if (response.data.success) {
          this.clearInputs();
          this.toggleVerifyDialog();
          Alert.alert(
            "Welcome!",
            response.data.message,
            [
              {
                text: "OK",
                onPress: () => {
                  this.props.navigation.navigate("Login");
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.log("Error with registering: ", error);
        alert("Error with registering. Please try again.");
      }
    } else {
      alert("Entered code is incorrect. Please try again.");
    }
  };

  handleLoginRedirect = () => {
    this.props.navigation.navigate("Login");
  };

  handleEnteredCodeChange = (event) => {
    this.setState({ enteredCode: event.nativeEvent.text });
  };

  handleResendCode = () => {
    alert("Code will be resent");
  };

  clearInputs = () => {
    this.setState({
      fName: "",
      lName: "",
      phone: "",
      password: "",
      passwordConfirm: "",
    });
  };

  toggleVerifyDialog = () => {
    //to prevent generated code from being reset
    if (this.state.showVerifyDialog) {
      this.setState({
        showVerifyDialog: !this.state.showVerifyDialog,
        generatedCode: "N/A",
        enteredCode: "",
      });
    } else {
      this.setState({ showVerifyDialog: !this.state.showVerifyDialog });
    }
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.mainContainer}>
          <DialogBox
            overlayProps={{
              isVisible: this.state.showVerifyDialog,
              onBackdropPress: this.toggleVerifyDialog,
            }}
            buttons={[
              {
                label: "Cancel",
                color: "#F75555",
                onPress: this.toggleVerifyDialog,
              },
              {
                label: "Resend",
                color: "#F79256",
                onPress: this.handleResendCode,
              },
              {
                label: "Verify",
                color: "#8ED5F5",
                onPress: this.handleRegistration,
              },
            ]}
            input={true}
            inputProps={{
              placeholder: "Code",
              onChange: this.handleEnteredCodeChange,
              value: this.state.enteredCode,
            }}
            showContent={false}
            title="Verification"
            description={true}
            description="Please enter the verification code we just texted you in order to complete registration."
          />
          <View style={styles.logoContainer}>
            <Image source={Logo} style={styles.logo} />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.inlineContainer}>
              <Input
                placeholder="First Name"
                ref="fName"
                leftIcon={{
                  type: "material-community",
                  name: "account",
                  color: "#00B2CA",
                }}
                onChange={(event) => {
                  this.handleInputChange(event, "fName");
                }}
                value={this.state.fName}
                errorMessage={this.state.fNameErrorMsg}
                containerStyle={styles.containerStyleName}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.inputStyle}
                labelStyle={styles.labelStyle}
                placeholderTextColor="#00B2CA"
              />
              <Input
                placeholder="Last Name"
                ref="lName"
                leftIcon={{
                  type: "material-community",
                  name: "account",
                  color: "#00B2CA",
                }}
                onChange={(event) => {
                  this.handleInputChange(event, "lName");
                }}
                value={this.state.lName}
                errorMessage={this.state.lNameErrorMsg}
                containerStyle={styles.containerStyleName}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.inputStyle}
                labelStyle={styles.labelStyle}
                placeholderTextColor="#00B2CA"
              />
            </View>
            <Input
              placeholder="Phone Number"
              ref="phone"
              leftIcon={{
                type: "material-community",
                name: "phone",
                color: "#00B2CA",
              }}
              onChange={(event) => {
                this.handleInputChange(event, "phone");
              }}
              errorMessage={this.state.phoneErrorMsg}
              value={this.state.phone}
              containerStyle={styles.containerStyle}
              inputContainerStyle={styles.inputContainerStyle}
              inputStyle={styles.inputStyle}
              labelStyle={styles.labelStyle}
              placeholderTextColor="#00B2CA"
            />
            <Input
              placeholder="Password"
              ref="password"
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
              ref="passwordConfirm"
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
          </View>
          <Button
            title="Create Account"
            raised
            onPress={this.handleVerification}
            containerStyle={styles.buttonContainerStyleReg}
            buttonStyle={styles.buttonStyle}
          />
          <Text style={styles.regText} onPress={this.handleLoginRedirect}>
            Already have an account?
          </Text>
        </View>
      </ScrollView>
    );
  }
}

export default withNavigation(Register);
