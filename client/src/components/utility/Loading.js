import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Dimensions,
  Image,
} from "react-native";
import Logo from "../../images/Logo.png";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F1ED",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: windowWidth,
    margin: windowWidth - 700,
  },
  logo: {
    resizeMode: "contain",
    width: windowWidth - 200,
  },
});

const Loading = () => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} />
      </View>
      <ActivityIndicator size="large" color="#F79256" />
    </View>
  );
};

export default Loading;
