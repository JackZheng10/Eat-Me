import React from "react";
import { StyleSheet, View, Modal, SafeAreaView } from "react-native";
import { Icon, Text, Divider } from "react-native-elements";
import WebView from "react-native-webview";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
    height: hp("5%"),
    width: wp("100%"),
  },
  modalHeaderText: {
    color: "limegreen",
    marginTop: hp("1%"),
    fontSize: hp("2.3%"),
    textAlign: "center",
  },
});

const WebModal = (props) => {
  return (
    <Modal
      animationType="slide"
      visible={props.visible}
      onRequestClose={props.exit}
      transparent={true}
    >
      <SafeAreaView style={{ flex: 0 }} />
      <View style={{ flex: 1 }}>
        <View style={styles.modalHeader}>
          <View style={{ width: wp("15%") }}>
            <Icon
              name="close"
              size={hp("3.5%")}
              style={{ margin: hp("1%") }}
              onPress={props.exit}
            />
          </View>
          <View style={{ width: wp("70%") }}>
            <Text style={styles.modalHeaderText}>{props.title}</Text>
          </View>
        </View>
        <Divider />
        <WebView source={{ uri: props.url }} />
      </View>
    </Modal>
  );
};

export default WebModal;
