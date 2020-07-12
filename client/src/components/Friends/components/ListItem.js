import React, { Component } from "react";
import { ListItem as RNEListItem } from "react-native-elements";

class ListItem extends Component {
  render() {
    const { listItemProps } = this.props;

    return <RNEListItem {...listItemProps} />;
  }
}

export default ListItem;
