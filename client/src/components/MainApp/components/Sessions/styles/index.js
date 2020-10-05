import { StyleSheet } from "react-native";

const SessionsStyles = StyleSheet.create({
  listItem: {
    margin: 10,
    borderStyle: "solid",
    borderColor: "#00B2CA",
    borderWidth: 2,
    borderRadius: 50,
  },
  containerStyle: {
    backgroundColor: "#fcfbfa",
    borderStyle: "solid",
    borderColor: "#F79256",
    borderRadius: 50,
  },
  titleStyle: {
    fontWeight: "bold",
    color: "#F79256",
  },
  subtitleStyle: {
    color: "black",
  },
  emptySession: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addSessionContainer: {
    position: "absolute",
    bottom: 25,
    right: 50,
  },
  sessionsContainer: {
    flex: 1,
    backgroundColor: "#F5F1ED",
  },
});

export { SessionsStyles };
