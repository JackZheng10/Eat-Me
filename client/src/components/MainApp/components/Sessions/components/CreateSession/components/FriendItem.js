import React, { Component } from "react";
import { ListItem } from "react-native-elements";
import { View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  selected: {
    width: 25,
    height: 25,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "green",
  },
});

class FriendItem extends Component {
  state = {
    selected: this.props.selected,
  };

  componentDidMount = () => {};

  componentDidUpdate = () => {};

  selectFriend = () => {
    this.props.onSelect(this.props.friend, !this.state.selected);
    this.setState({
      selected: !this.state.selected,
    });
  };

  renderSelectedElement = () => {
    const backgroundColorStyle = this.getBackgroundColorStyle();
    const combinedStyle = StyleSheet.flatten([
      styles.selected,
      backgroundColorStyle,
    ]);
    return <View style={combinedStyle}></View>;
  };

  getBackgroundColorStyle = () => {
    const backgroundColor = this.state.selected ? "green" : "white";
    return { backgroundColor };
  };

  render() {
    const { friend } = this.props;

    return (
      <ListItem
        onPress={this.selectFriend}
        title={friend.fName}
        titleStyle={{ color: "#F79256" }}
        subtitle={friend.lName}
        rightElement={this.renderSelectedElement}
        bottomDivider
      />
    );
  }
}

export default FriendItem;
