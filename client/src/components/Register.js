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
  input: {
    padding: 10,
  },
});

class Register extends Component {
  state = { fName: "", lName: "", phone: "", password: "" };

  handleChange = (event, property) => {
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
    }
  };

  render() {
    return (
      <Content>
        <Grid>
          <Container>
            <Col style={styles.mainColumn}>
              <Row size={1}>
                <Text style={styles.header}>Register</Text>
              </Row>
              <Row size={1}>
                <Col>
                  <Row style={styles.input}>
                    <Input
                      placeholder="First Name"
                      leftIcon={{ type: "material-community", name: "account" }}
                      onChange={(event) => {
                        this.handleChange(event, "fName");
                      }}
                      value={this.state.fName}
                    />
                  </Row>
                  <Row style={styles.input}>
                    <Input
                      placeholder="Last Name"
                      leftIcon={{ type: "material-community", name: "account" }}
                      onChange={(event) => {
                        this.handleChange(event, "lName");
                      }}
                      value={this.state.lName}
                    />
                  </Row>
                  <Row style={styles.input}>
                    <Input
                      placeholder="Phone Number"
                      leftIcon={{ type: "material-community", name: "phone" }}
                      onChange={(event) => {
                        this.handleChange(event, "phone");
                      }}
                      value={this.state.phone}
                    />
                  </Row>
                  <Row style={styles.input}>
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
                </Col>
              </Row>
              <Row size={1}>
                <Button title="Register" raised onPress={this.handleRegister} />
              </Row>
            </Col>
          </Container>
        </Grid>
      </Content>
    );
  }
}

export default Register;
