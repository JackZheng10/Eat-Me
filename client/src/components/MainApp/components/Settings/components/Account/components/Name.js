import React, { Component } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import { getCurrentUser } from "../../../../../../../helpers/session";

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

class Name extends Component {
  state = { fName: "", lName: "" };

  componentDidMount = async () => {
    //todo: maybe fetch details on settings page itself for efficiency? since need darkmode anyways and just pass inside with nav.navigate
    let currentUser = await getCurrentUser();

    this.setState({
      fName: currentUser.fName,
      lName: currentUser.lName,
      fNameErrorMsg: "",
      lNameErrorMsg: "",
    });
  };

  handleInputChange = (event, property) => {
    let input = event.nativeEvent.text;
    const nameRegex = /^[a-zA-Z][a-zA-Z\s]*$/;

    if (input === "" || nameRegex.test(input)) {
      this.setState({ [property]: input });
    }
  };

  handleInputValidation = () => {
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
    }

    return valid;
  };

  handleUpdateName = () => {
    if (this.handleInputValidation()) {
      console.log("can update");
      //still need to check if it's different or not
    }
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.inputContainer}>
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
            containerStyle={styles.containerStyle}
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
            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            placeholderTextColor="#00B2CA"
          />
          <Button
            title="Save"
            raised
            onPress={this.handleUpdateName}
            containerStyle={styles.buttonContainerStyle}
            buttonStyle={styles.buttonStyle}
          />
        </View>
      </View>
    );
  }
}

export default Name;
