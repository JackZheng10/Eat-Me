import React, { Component } from "react";
import { View, StyleSheet, ScrollView, YellowBox } from "react-native";
import { withNavigation } from "react-navigation";
import { getCurrentUser, updateToken } from "../../../../helpers/session";
import baseURL from "../../../../../baseURL";
import axios from "axios";
import CreateSession from "./components/CreateSession/CreateSession";
import { ListItem, Text, Icon } from "react-native-elements";
import { SocketContext } from "../../../../contexts";

//Ignores warning about passing in function callback to individual Session
YellowBox.ignoreWarnings([
  "Non-serializable values were found in the navigation state",
]);

const styles = StyleSheet.create({
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

class Sessions extends Component {
  static contextType = SocketContext;
  state = {
    key: 0,
    sessionList: [],
    modalVisible: false,
    userID: null,
  };

  componentDidMount = async () => {
    const currentUser = await getCurrentUser();

    await this.addSocketListeners(this.context.SIO, currentUser.phone);

    const userSessions = await axios.post(baseURL + "/user/getUserSessions", {
      ID: currentUser.ID,
    });

    if (userSessions.data.success) {
      this.setState({
        sessionList: userSessions.data.sessions,
        userID: currentUser.ID,
      });
    } else {
      alert("Error retrieving sessions");
    }
  };

  addSocketListeners = async (socket, phone) => {
    socket.on("sessionMatch", async (data) => {
      if (await updateToken(phone)) {
        //Gold Circle around actual session - render conditons will handle approproate styling
        this.updateSessionStatus(data.sessionID, data.status);
      }
    });

    //Practice Notification
    socket.on("testingSessions", async (data) => {
      if (await updateToken(phone)) {
        alert(data.data);
      }
    });
  };

  updateSessionStatus = (sessionID, status) => {
    let newSessionList = [...this.state.sessionList];
    for (let i = 0; i < newSessionList.length; i++) {
      if (newSessionList[i].ID == sessionID) {
        for (let j = 0; j < newSessionList[i].members.length; j++) {
          if (newSessionList[i].members[j].userID == this.state.userID) {
            newSessionList[i].members[j].status = status;
            break;
          }
        }
        break;
      }
    }
    this.setState({
      sessionList: newSessionList,
    });
  };

  setSessionsView = () => {
    if (this.state.sessionList.length == 0)
      return this.renderEmptySessionsView();
    else {
      return <ScrollView>{this.renderSessions()}</ScrollView>;
    }
  };

  renderEmptySessionsView = () => {
    return (
      <View style={styles.emptySession}>
        <Text h3 style={{ color: "#F79256" }}>
          Create a New Session!
        </Text>
      </View>
    );
  };

  renderSession = (sessionDetails) => {
    //Passing in callback causes warning. Ignored by Yellowbox instruction at the top of the file
    this.props.navigation.push("Session", {
      sessionDetails,
      updateSessionStatus: this.updateSessionStatus,
    });
  };

  renderSessions = () => {
    return this.state.sessionList.map((session) => {
      const member = session.members.filter((sessionMember) => {
        return sessionMember.userID == this.state.userID;
      });

      //Status is based on individual member in Session or if match was found
      const memberStatus =
        session.matchedRestaurantIndex != -1 ? "Matched" : member[0].status;

      return (
        <ListItem
          onPress={() => this.renderSession(session)}
          key={session.ID}
          leftElement={this.renderSessionMembers}
          title={session.membersNames.toString()}
          titleStyle={styles.titleStyle}
          subtitle={memberStatus}
          subtitleStyle={styles.subtitleStyle}
          avatar
          style={styles.listItem}
          containerStyle={styles.containerStyle}
          rightIcon={this.renderSessionStatus(session.Status)}
        />
      );
    });
  };

  renderSessionMembers = () => {
    //Idea - Return circular picture of all friends in session. Small though,
    return <Icon name="person" />;
  };

  renderSessionStatus = (sessionStatus) => {
    let sessionIcon;
    switch (sessionStatus) {
      case "No Match": {
        sessionIcon = "check";
        break;
      }
      case "No Progress": {
        sessionIcon = "hourglass-empty";
        break;
      }
      case "Match": {
        sessionIcon = "check";
        break;
      }
    }

    return (
      <Icon name={sessionIcon} color="#F79256" style={{ marginRight: 10 }} />
    );
  };

  createNewSession = () => {
    this.setState({ modalVisible: true });
    //this.props.navigation.push("CreateSession");
  };

  exitModal = () => {
    //Key is used to reset Modal compoent when
    this.setState({
      modalVisible: false,
      key: this.state.key + 1,
    });
  };

  addSessionToSessionList = (newSession) => {
    this.setState({
      sessionList: [...this.state.sessionList, newSession],
    });
  };

  render() {
    return (
      <View style={styles.sessionsContainer}>
        {this.setSessionsView()}

        <CreateSession
          key={this.state.key}
          modalVisible={this.state.modalVisible}
          exitModal={this.exitModal}
          addSession={this.addSessionToSessionList}
        />

        <View style={styles.addSessionContainer}>
          <Icon
            onPress={this.createNewSession}
            name="add"
            type="material"
            color="#F79256"
            raised
            reverse
          />
        </View>
      </View>
    );
  }
}

export default withNavigation(Sessions);
