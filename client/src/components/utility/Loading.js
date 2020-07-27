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
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
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

const Loading = (props) => {
  return (
    <View style={styles.mainContainer}>
      {props.showLogo && (
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} />
        </View>
      )}
      <ActivityIndicator size="large" color="#F79256" />
    </View>
  );
};

export default Loading;
