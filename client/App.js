import React, { Component } from "react";
import { StyleSheet, Text, SafeAreaView, Button } from "react-native";
import axios from "axios";
import baseURL from "./baseURL";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

class App extends Component {
  simpleRequest = async () => {
    await axios
      .post(baseURL + "/simple/helloWorld", {})
      .then((res) => {
        if (res.data.success) {
          alert("Response from server: " + res.data.message);
        } else {
          alert("You shouldn't see this");
        }
      })
      .catch((error) => {
        alert("Error: " + error);
      });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Here is a simple button that communicates with the backend!</Text>
        <Button title="Click me" color="#841584" onPress={this.simpleRequest} />
      </SafeAreaView>
    );
  }
}

export default App;
