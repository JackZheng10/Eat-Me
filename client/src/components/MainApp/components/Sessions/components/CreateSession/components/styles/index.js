import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ModalStyles = StyleSheet.create({
  headerCenterText: {
    color: "#FFF",
    fontSize: 20,
  },
  content: {
    flex: 8,
    backgroundColor: "#F5F1ED",
  },
  footer: {
    flex: 1,
    backgroundColor: "#00B2CA",
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  updateSessionButton: {
    backgroundColor: "#F79256",
    marginTop: 10,
  },
});

const CategoriesStyles = StyleSheet.create({
  categoriesRow: {
    flex: 1,
    backgroundColor: "#F5F1ED",
  },
  categoryView: {
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

const LocationStyles = StyleSheet.create({
  locationInputView: {
    position: "absolute",
    top: 20,
    width: "100%",
  },
  locationInputContainer: {
    borderRadius: 50,
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "white",
  },
});

const SelectFriendsStyles = StyleSheet.create({
  searchContainerStyle: {
    backgroundColor: "#F5F1ED",
    width: "100%",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
  },
  searchInputStyle: {
    color: "black",
    marginRight: 5,
    marginLeft: 5,
  },
  searchInputContainerStyle: {
    backgroundColor: "white",
    borderRadius: 40,
  },
});

const FriendItemStyles = StyleSheet.create({
  friendSelected: {
    width: 25,
    height: 25,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "green",
  },
});

const SessionSaveStyles = StyleSheet.create({
  sectionHeader: {
    color: "#F79256",
    textAlign: "center",
  },
  sessionReviewMap: {
    width: wp("75%"),
    height: hp("35%"),
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
  },
});

export {
  ModalStyles,
  CategoriesStyles,
  LocationStyles,
  SelectFriendsStyles,
  FriendItemStyles,
  SessionSaveStyles,
};
