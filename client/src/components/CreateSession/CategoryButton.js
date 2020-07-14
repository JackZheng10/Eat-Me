import React, { Component } from "react";
import { Button, Text } from "native-base";

class CategoryButton extends Component {
	state = {
		selected: false,
	};

	componentDidMount = () => {};

	componentDidUpdate = () => {};

	selectCategory = () => {
		this.props.onSelect(this.props.category, !this.state.selected);
		this.setState({
			selected: !this.state.selected,
		});
	};

	render() {
		const { category } = this.props;
		return (
			<Button bordered={!this.state.selected} onPress={this.selectCategory}>
				<Text>{category}</Text>
			</Button>
		);
	}
}

export default CategoryButton;
