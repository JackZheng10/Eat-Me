import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { Input, Button } from "react-native-elements";
import { Col, Row, Grid } from "react-native-easy-grid";
import { withNavigation } from "react-navigation";
import Constants from "expo-constants";
import axios from "axios";
import Logo from "../../images/Logo.png";
import baseURL from "../../../baseURL";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#F5F1ED",
  },
  fieldContainer: {
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
    paddingLeft: 10,
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
    margin: windowWidth - 490,
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
    pwdErrorMsg: "",
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
            input = input.substr(0, input.length - 1);
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
    const { fName, lName, phone, password, passwordConfirm } = this.state;

    //first name
    if (this.evaluateWhitespace(fName)) {
      this.setState({ fNameErrorMsg: "Please enter a first name." });
    }

    if (this.evaluateWhitespace(lName)) {
      this.setState({ lNameErrorMsg: "Please enter a last name." });
    }
  };

  evaluateWhitespace = (text) => {
    if (!text.replace(/\s/g, "").length) {
      return true;
    }

    return false;
  };

  handleRegister = async () => {
    //validation here (no empty fields, requirements, etc.), then:
    this.handleInputValidation();

    // const { fName, lName, phone, password } = this.state;

    // try {
    //   const response = await axios.post(`${baseURL}/user/register`, {
    //     fName,
    //     lName,
    //     phone,
    //     password,
    //   });

    //   alert(response.data.message);
    // } catch (error) {
    //   console.log(error);
    //   alert("Error with registering. Please try again.");
    // }
  };

  handleLoginRedirect = () => {
    this.props.navigation.navigate("Login");
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.mainContainer}>
          <View style={styles.logoContainer}>
            <Image source={Logo} style={styles.logo} />
          </View>
          <View style={styles.fieldContainer}>
            <View style={styles.inlineContainer}>
              <Input
                placeholder="First Name"
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
              leftIcon={{
                type: "material",
                name: "lock",
                color: "#00B2CA",
              }}
              onChange={(event) => {
                this.handleInputChange(event, "password");
              }}
              errorMessage={this.state.pwdErrorMsg}
              value={this.state.password}
              containerStyle={styles.containerStyle}
              inputContainerStyle={styles.inputContainerStyle}
              inputStyle={styles.inputStyle}
              labelStyle={styles.labelStyle}
              placeholderTextColor="#00B2CA"
              secureTextEntry={true}
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
              containerStyle={styles.containerStyle}
              inputContainerStyle={styles.inputContainerStyle}
              inputStyle={styles.inputStyle}
              labelStyle={styles.labelStyle}
              placeholderTextColor="#00B2CA"
              secureTextEntry={true}
            />
          </View>
          <Button
            title="Create Account"
            raised
            onPress={this.handleRegister}
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
