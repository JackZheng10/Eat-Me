import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const SessionStyles = StyleSheet.create({
  memberFinishedContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    marginTop: hp("3%"),
  },
  memberFinishedHeader: {
    fontSize: hp("4.2%"),
    color: "#00B2CA",
    textAlign: "center",
  },
  memberFinishedButton: {
    marginTop: hp("2%"),
    backgroundColor: "#F79256",
    width: wp("75%"),
    borderRadius: 50,
  },
  memberFinishedSelectionContainer: {
    marginTop: hp("5%"),
    alignItems: "center",
  },
  memberFinishedSelectionDivider: {
    backgroundColor: "#F79256",
    width: wp("90%"),
    height: hp("0.2%"),
  },
  memberFinishedSelectionText: {
    marginTop: hp("1%"),
    textAlign: "center",
    fontSize: hp("2.2%"),
    color: "#00B2CA",
  },
  matchedContainer: {
    flex: 1,
    alignItems: "center",
  },
  matchedHeader: {
    fontSize: hp("4.2%"),
    color: "#F79256",
    marginTop: hp("2.5%"),
    fontWeight: "bold",
  },
  matchedRestaurantDetailsTextContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: wp("100%"),
    marginTop: hp("2%"),
  },
  matchedRestaurantDetailsText: {
    fontSize: hp("3%"),

    color: "#10a6af",
  },
  matchedRestaurantDetailsButtonContainer: {
    flexDirection: "column",
    marginTop: hp("2%"),
    justifyContent: "space-around",
    height: hp("15%"),
  },
  matchedRestaurantDetailsButton: {
    height: hp("5%"),
    width: wp("75%"),
    borderRadius: 50,
    backgroundColor: "#F79256",
  },
  searchRestaurantsContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
  },
  searchRestaurantsSwiperSection: {
    height: "80%",
    width: "100%",
  },
  searchRestaurantsBottomSection: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: hp("3%"),
  },
  searchRestaurantsIconContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  searchRestaurantsOverlayWrapper: {
    flexDirection: "column",
    justifyContent: "flex-start",
    marginTop: 30,
  },
});

export { SessionStyles };
