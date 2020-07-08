import React, { Component } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Content, Text, Container } from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Input, Button } from "react-native-elements";
import axios from "axios";
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

  handleChange = (event, property) => {
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

    try {
      const response = await axios.post(`${baseURL}/user/login`, {
        phone: this.state.phone,
        password: this.state.password,
      });

      console.log(response.data.message);
    } catch (error) {
      console.log(error);
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
                        this.handleChange(event, "phone");
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
                        this.handleChange(event, "password");
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
