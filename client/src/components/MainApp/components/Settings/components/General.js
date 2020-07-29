import React, { Component } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F1ED",
  },
});

class General extends Component {
  render() {
    return (
      <View style={styles.mainContainer}>
        <Text style={{ textAlign: "center" }}>
          push notifcations...what else? if just notifications then move it to a
          toggle on settings
        </Text>
      </View>
    );
  }
}

export default General;
