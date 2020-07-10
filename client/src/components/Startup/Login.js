import React, { Component } from "react";
import { View, ScrollView, StyleSheet, Dimensions, Image } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import { Col, Row, Grid } from "react-native-easy-grid";
import { withNavigation } from "react-navigation";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import jwtDecode from "jwt-decode";
import baseURL from "../../../baseURL";
import Logo from "../../images/Logo.png";

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
  loginFieldContainer: {
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
    elevation: 24,
  },
  containerStyle: {
    width: windowWidth - 150,
  },
  inputContainerStyle: {
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#00B2CA",
    paddingLeft: 10,
  },
  inputStyle: {
    marginLeft: 10,
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
    margin: -80,
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

class Login extends Component {
  state = { phone: "", password: "" };

  handleInputChange = (event, property) => {
    let input = event.nativeEvent.text;

    switch (property) {
      case "phone":
        const regex = /^[0-9\b]+$/;

        if (input === "" || regex.test(input)) {
          if (input.length > 10) {
            input = input.substr(0, input.length - 1);
          }
          this.setState({ [property]: input });
        }

        break;

      case "password":
        this.setState({ [property]: input });
        break;
    }
  };

  handleLogin = async () => {
    //validation here, then:

    //attempt to login
    try {
      const response = await axios.post(`${baseURL}/user/login`, {
        phone: this.state.phone,
        password: this.state.password,
      });

      //if login successful
      if (response.data.success) {
        try {
          //store JWT token
          const token = response.data.token;
          await AsyncStorage.setItem("@token", token);

          alert("Logged in successfully, see console for token info");

          //demonstration of how to fetch and decode the token
          try {
            const value = await AsyncStorage.getItem("@token");

            if (value !== null) {
              const data = jwtDecode(value);
              console.log(data);
            }
          } catch (error) {
            console.log("Error with retrieving token: " + error);
          }
        } catch (error) {
          console.log(error);
          alert("Error with logging in. Please try again.");
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Error with logging in. Please try again.");
    }
  };

  handleRegisterRedirect = () => {
    this.props.navigation.navigate("Register");
  };

  handleRecoveryRedirect = () => {
    alert("This will take you to a password recovery screen.");
  };

  render() {
    return (
      // <View style={styles.wrapperContainer}>
      /*^^^used for making elements not shift up due to keyboard? works without it i think. (android...)*/
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
        <View style={styles.loginFieldContainer}>
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
            value={this.state.password}
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
      // </View>
    );
  }
}

export default withNavigation(Login);
