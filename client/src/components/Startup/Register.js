import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Input, Button } from "react-native-elements";
import { Col, Row, Grid } from "react-native-easy-grid";
import { withNavigation } from "react-navigation";
import Constants from "expo-constants";
import axios from "axios";
import baseURL from "../../../baseURL";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
  },
  mainColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontWeight: "bold",
    fontSize: 50,
  },
});

class Register extends Component {
  state = { fName: "", lName: "", phone: "", password: "" };

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
    }
  };

  handleRegister = async () => {
    //validation here (no empty fields, requirements, etc.), then:

    try {
      const response = await axios.post(`${baseURL}/user/register`, {
        fName: this.state.fName,
        lName: this.state.lName,
        phone: this.state.phone,
        password: this.state.password,
      });

      alert(response.data.message);
    } catch (error) {
      console.log(error);
      alert("Error with registering. Please try again.");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Grid>
          <Col style={styles.mainColumn}>
            <Row size={10}>
              <Text style={styles.header}>Register</Text>
            </Row>
            <Row size={20}>
              <Col>
                <Input
                  placeholder="First Name"
                  leftIcon={{ type: "material-community", name: "account" }}
                  onChange={(event) => {
                    this.handleInputChange(event, "fName");
                  }}
                  value={this.state.fName}
                />
                <Input
                  placeholder="Last Name"
                  leftIcon={{ type: "material-community", name: "account" }}
                  onChange={(event) => {
                    this.handleInputChange(event, "lName");
                  }}
                  value={this.state.lName}
                />
                <Input
                  placeholder="Phone Number"
                  leftIcon={{ type: "material-community", name: "phone" }}
                  onChange={(event) => {
                    this.handleInputChange(event, "phone");
                  }}
                  value={this.state.phone}
                />
                <Input
                  placeholder="Password"
                  leftIcon={{
                    type: "material-community",
                    name: "onepassword",
                  }}
                  onChange={(event) => {
                    this.handleInputChange(event, "password");
                  }}
                  value={this.state.password}
                />
              </Col>
            </Row>
            <Row size={20}>
              <Col>
                <Button title="Register" raised onPress={this.handleRegister} />
              </Col>
            </Row>
          </Col>
        </Grid>
      </View>
    );
  }
}

export default withNavigation(Register);
