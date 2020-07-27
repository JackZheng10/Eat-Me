import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F1ED",
  },
});

const Loading = () => {
  return (
    <View style={styles.mainContainer}>
      <ActivityIndicator size="large" color="#F79256" />
    </View>
  );
};

export default Loading;
