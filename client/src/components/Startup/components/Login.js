import React, { PureComponent } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  Keyboard,
} from "react-native";
import { Input, Button, Text } from "react-native-elements";
import { withNavigation } from "react-navigation";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import jwtDecode from "jwt-decode";
import baseURL from "../../../../baseURL";
import Logo from "../../../images/Logo.png";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

//ideas: https://www.google.com/search?q=mobile+registration+ui&source=lnms&tbm=isch&sa=X&ved=2ahUKEwic15ewkcLqAhUCTN8KHQL_AToQ_AUoAXoECAwQAw&biw=1920&bih=937#imgrc=XaAl_tHb7lZG0M

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
  containerStyle: {
    width: windowWidth - 150,
  },
  inputContainerStyle: {
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#00B2CA",
    paddingLeft: 10,
    paddingRight: 10,
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
  // mainColumn: {
  //   flex: 1,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   height: windowHeight,
  // },
  // header: {
  //   fontWeight: "bold",
  //   fontSize: 50,
  //   color: "#00B2CA",
  // },
  // wrapperContainer: {
  //   height: windowHeight - 45,
  //   // flex: 1,
  // },
});

//pure component needed: https://reactnavigation.org/docs/hello-react-navigation/#passing-additional-props
//todo: maybe consider using react context, wrapping navigator with context provider
class Login extends PureComponent {
  state = { phone: "", password: "", phoneErrorMsg: "", passwordErrorMsg: "" };

  componentDidMount() {
    //for android since inputs are still focused when exiting keyboard
    Keyboard.addListener("keyboardDidHide", this.unfocusInputs);
  }

  unfocusInputs = () => {
    const inputs = ["phone", "password"];

    inputs.forEach((input) => {
      if (this.refs[input]) {
        this.refs[input].blur();
      }
    });
  };

  handleInputChange = (event, property) => {
    let input = event.nativeEvent.text;

    switch (property) {
      case "phone":
        const phoneRegex = /^[0-9\b]+$/;

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
    }
  };

  handleInputValidation = () => {
    let valid = true;

    const inputs = [
      {
        name: "phone",
        whitespaceMsg: "Please enter a 10-digit phone number.",
      },
      {
        name: "password",
        whitespaceMsg: "Please enter a password.",
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
      if (input.name === "phone") {
        if (value.length < 10) {
          this.setState({
            [input.name + "ErrorMsg"]: "Please enter a 10-digit phone number.",
          });
          valid = false;
        } else {
          this.setState({ [input.name + "ErrorMsg"]: "" });
        }
      }
    }

    return valid;
  };

  handleLogin = async () => {
    let valid = this.handleInputValidation();

    if (valid) {
      const { phone, password } = this.state;
      //attempt to login
      try {
        const response = await axios.post(`${baseURL}/user/login`, {
          phone,
          password,
        });

        //if login successful
        if (response.data.success) {
          try {
            //store JWT token
            const token = response.data.token;
            await AsyncStorage.setItem("@token", token);

            this.clearInputs();
            this.props.handleLoginCheck();
          } catch (error) {
            console.log("Error with logging in: ", error);
            alert("Error with logging in. Please try again.");
          }
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.log("Error with logging in: ", error);
        alert("Error with logging in. Please try again.");
      }
    }
  };

  handleRegisterRedirect = () => {
    this.props.navigation.navigate("Register");
  };

  handleRecoveryRedirect = () => {
    alert("This will take you to a password recovery screen.");
  };

  clearInputs = () => {
    this.setState({ phone: "", password: "" });
  };

  render() {
    return (
      // <View style={styles.wrapperContainer}>
      /*^^^used for making elements not shift up due to keyboard? works without it i think. (android...)*/
      <ScrollView>
        <View style={styles.mainContainer}>
          {/* <Grid>
          <Col style={styles.mainColumn}>
            <Row size={10}> */}
          <View style={styles.logoContainer}>
            <Image source={Logo} style={styles.logo} />
          </View>
          {/* <Text style={styles.header}>Login</Text> */}
          {/* </Row>
            <Row size={10}>
              <Col> */}
          <View style={styles.inputContainer}>
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
              value={this.state.phone}
              errorMessage={this.state.phoneErrorMsg}
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
              value={this.state.password}
              errorMessage={this.state.passwordErrorMsg}
              containerStyle={styles.containerStyle}
              inputContainerStyle={styles.inputContainerStyle}
              inputStyle={styles.inputStyle}
              labelStyle={styles.labelStyle}
              placeholderTextColor="#00B2CA"
              secureTextEntry={true}
            />
          </View>
          {/* </Col>
            </Row>
            <Row size={20}>
              <Col> */}
          <Button
            title="Log In"
            raised
            onPress={this.handleLogin}
            containerStyle={styles.buttonContainerStyle}
            buttonStyle={styles.buttonStyle}
            // linearGradientProps={{
            //   colors: ["#F79256", "#F44336"],
            //   start: [1, 0],
            //   end: [0.2, 0],
            // }}
          />
          <Button
            title="Register"
            raised
            onPress={this.handleRegisterRedirect}
            containerStyle={styles.buttonContainerStyleReg}
            buttonStyle={styles.buttonStyle}
            // linearGradientProps={{
            //   colors: ["#F79256", "#F44336"],
            //   start: [1, 0],
            //   end: [0.2, 0],
            // }}
          />
          <Text style={styles.regText} onPress={this.handleRecoveryRedirect}>
            Forgot password?
          </Text>
          {/* </Col>
            </Row>
          </Col>
        </Grid> */}
        </View>
      </ScrollView>
    );
  }
}

export default withNavigation(Login);
