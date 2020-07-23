import React, { Component } from "react";
import { Button } from "react-native-elements";

class CategoryButton extends Component {
  state = {
    selected: this.props.selected,
  };

  componentDidMount = () => {};

  componentDidUpdate = () => {};

  selectCategory = () => {
    this.props.onSelect(this.props.category, !this.state.selected);
    this.setState({
      selected: !this.state.selected,
    });
  };

  //Bordered and color <=> background and white
  setButtonStyle = () => {
    //Pass in color as a prop or randomly select
    return this.state.selected
      ? { backgroundColor: "#F79256" }
      : { backgroundColor: "white", borderWidth: 1, borderColor: "#F79256" };
  };

  setTitleStyle = () => {
    return this.state.selected ? { color: "white" } : { color: "#F79256" };
  };

  render() {
    const { category } = this.props;
    return (
      <Button
        onPress={this.selectCategory}
        title={category}
        buttonStyle={this.setButtonStyle()}
        titleStyle={this.setTitleStyle()}
      />
    );
  }
}

export default CategoryButton;
