import React, { Component } from "react";
import { View } from "react-native";
import { ListItem as RNEListItem, Icon } from "react-native-elements";

class ListItem extends Component {
  constructor(props) {
    super(props);

    this.state = { rightIcon: this.defaultIcon(), default: true };
  }

  toggleIcons = () => {
    if (this.state.default) {
      this.setState({ rightIcon: this.tappedIcons(), default: false });
    } else {
      this.setState({ rightIcon: this.defaultIcon(), default: true });
    }
  };

  defaultIcon = () => {
    return {
      type: "font-awesome",
      name: "angle-right",
      color: "#F79256",
      size: 35,
    };
  };

  tappedIcons = () => {
    return (
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Icon
          name="paper-plane"
          type="entypo"
          raised
          reverse
          color="#F79256"
          containerStyle={{
            marginTop: -10,
            marginBottom: -10,
          }}
        />
        <Icon
          name="trash-can-outline"
          type="material-community"
          raised
          reverse
          color="#F75555"
          containerStyle={{ marginTop: -10, marginBottom: -10 }}
        />
      </View>
    );
  };

  render() {
    const { listItemProps } = this.props;

    return (
      <RNEListItem
        {...listItemProps}
        rightIcon={this.state.rightIcon}
        onPress={this.toggleIcons}
      />
    );
  }
}

export default ListItem;
