import React, { Component } from "react";
import { Text, View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Input, Button } from "react-native-elements";
import { Col, Row, Grid } from "react-native-easy-grid";
import { withNavigation } from "react-navigation";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import jwtDecode from "jwt-decode";
import baseURL from "../../../baseURL";

const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#FBD1A2",
    height: windowHeight,
  },
  loginFieldContainer: {
    width: "90%",
    alignItems: "center",
    backgroundColor: "#7DCFB6",
    paddingTop: 20,
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
  header: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#00B2CA",
  },
  inputContainer: {
    width: "70%",
  },
  inputLabel: {
    color: "black",
  },
  buttonContainer: {
    width: "60%",
  },
  button: {
    backgroundColor: "#00B2CA",
  },
  // mainColumn: {
  //   flex: 1,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   height: windowHeight,
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

  render() {
    return (
      <View style={styles.container}>
        {/* <Grid>
          <Col style={styles.mainColumn}>
            <Row size={10}> */}
        <Text style={styles.header}>Login</Text>
        {/* </Row>
            <Row size={10}>
              <Col> */}
        <View style={styles.loginFieldContainer}>
          <Input
            label="Phone Number"
            leftIcon={{ type: "material-community", name: "phone" }}
            onChange={(event) => {
              this.handleInputChange(event, "phone");
            }}
            value={this.state.phone}
            containerStyle={styles.inputContainer}
            labelStyle={styles.inputLabel}
          />
          <Input
            label="Password"
            leftIcon={{
              type: "material-community",
              name: "onepassword",
            }}
            onChange={(event) => {
              this.handleInputChange(event, "password");
            }}
            value={this.state.password}
            containerStyle={styles.inputContainer}
            labelStyle={styles.inputLabel}
          />
        </View>
        {/* </Col>
            </Row>
            <Row size={20}>
              <Col> */}
        <Button
          title="Login"
          raised
          onPress={this.handleLogin}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
        />

        {/* </Col>
            </Row>
          </Col>
        </Grid> */}
      </View>
    );
  }
}

export default withNavigation(Login);
