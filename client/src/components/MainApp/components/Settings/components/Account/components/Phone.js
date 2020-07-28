import React, { Component } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import {
  getCurrentUser,
  updateToken,
} from "../../../../../../../helpers/session";
import { DialogBox } from "../../../../../../utility/";
import axios from "axios";
import baseURL from "../../../../../../../../baseURL";

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

class Phone extends Component {
  state = {
    phone: "",
    showVerifyDialog: false,
    generatedCode: "",
    enteredCode: "",
  };

  componentDidMount = async () => {
    //todo: maybe fetch details on settings page itself for efficiency? since need darkmode anyways and just pass inside with nav.navigate
    let currentUser = await getCurrentUser();

    this.setState({
      phone: currentUser.phone,
      phoneErrorMsg: "",
    });
  };

  toggleVerifyDialog = () => {
    //to prevent generated code from being reset
    if (this.state.showVerifyDialog) {
      this.setState({
        showVerifyDialog: !this.state.showVerifyDialog,
        generatedCode: "",
        enteredCode: "",
      });
    } else {
      this.setState({ showVerifyDialog: !this.state.showVerifyDialog });
    }
  };

  handleEnteredCodeChange = (event) => {
    this.setState({ enteredCode: event.nativeEvent.text });
  };

  handleResendCode = () => {
    alert("Code will be resent");
  };

  handleInputChange = (event, property) => {
    let input = event.nativeEvent.text;
    const phoneRegex = /^[0-9\b]+$/;

    if (input === "" || phoneRegex.test(input)) {
      if (input.length > 10) {
        input = input.substr(0, 10);
      }
      this.setState({ [property]: input });
    }
  };

  handleInputValidation = async () => {
    let currentUser = await getCurrentUser();
    let valid = true;
    let value = this.state.phone;

    if (this.state.phone === currentUser.phone) {
      alert("Please enter an updated phone number.");
      valid = false;
    }

    if (!value.replace(/\s/g, "").length) {
      this.setState({ phoneErrorMsg: "Please enter a 10-digit phone number." });
      valid = false;
    } else {
      this.setState({ phoneErrorMsg: "" });
    }

    if (value.length < 10) {
      this.setState({
        phoneErrorMsg: "Please enter a 10-digit phone number.",
      });
      valid = false;
    } else {
      this.setState({ phoneErrorMsg: "" });
    }

    return valid;
  };

  handleVerification = async () => {
    if (await this.handleInputValidation()) {
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

  handleUpdatePhone = async () => {
    if (this.state.generatedCode === this.state.enteredCode) {
      //update phone number, todo: send a socket event to all their friends to update list, request, session, etc?
      let currentUser = await getCurrentUser();

      try {
        const response = await axios.put(`${baseURL}/user/updatePhone`, {
          phone: currentUser.phone,
          newPhone: this.state.phone,
        });

        if (response.data.success) {
          await updateToken(this.state.phone);
          this.toggleVerifyDialog();
          this.props.route.params.updateInfo("Phone", this.state.phone);
        }

        alert(response.data.message);
      } catch (error) {
        console.log("Error with updating phone: ", error);
        alert("Error with updating phone. Please try again.");
      }
    } else {
      alert("Entered code is incorrect. Please try again.");
    }
  };

  render() {
    return (
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
              onPress: this.handleUpdatePhone,
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
          description="Please enter the verification code we just texted you in order to update your phone number."
        />
        <View style={styles.inputContainer}>
          <Input
            placeholder="Phone"
            leftIcon={{
              type: "material-community",
              name: "phone",
              color: "#00B2CA",
            }}
            value={this.state.phone}
            errorMessage={this.state.phoneErrorMsg}
            onChange={(event) => {
              this.handleInputChange(event, "phone");
            }}
            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            placeholderTextColor="#00B2CA"
          />
          <Button
            title="Save"
            raised
            onPress={this.handleVerification}
            containerStyle={styles.buttonContainerStyle}
            buttonStyle={styles.buttonStyle}
          />
        </View>
      </View>
    );
  }
}

export default Phone;
