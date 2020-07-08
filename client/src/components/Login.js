import React, { Component } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Content, Text, Container } from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Input, Button } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import jwtDecode from "jwt-decode";
import baseURL from "../../baseURL";

const styles = StyleSheet.create({
  mainColumn: {
    alignItems: "center",
    backgroundColor: "#EFE6DD",
  },
  header: {
    fontWeight: "bold",
    fontSize: 50,
  },
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
      <Content>
        <Grid>
          <Container>
            <Col style={styles.mainColumn}>
              <Row size={1}>
                <Text style={styles.header}>Login</Text>
              </Row>
              <Row size={1}>
                <Col>
                  <Row>
                    <Input
                      placeholder="Phone Number"
                      leftIcon={{ type: "material-community", name: "phone" }}
                      onChange={(event) => {
                        this.handleInputChange(event, "phone");
                      }}
                      value={this.state.phone}
                    />
                  </Row>
                  <Row>
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
                  </Row>
                  <Button title="Login" raised onPress={this.handleLogin} />
                </Col>
              </Row>
              <Row size={2}></Row>
            </Col>
          </Container>
        </Grid>
      </Content>
    );
  }
}

export default Login;
