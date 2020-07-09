import React, { Component } from "react";
import {
	Container,
	Header,
	Content,
	Footer,
	Button,
	Text,
	Col,
	Left,
	Icon,
	Body,
	Title,
	Right,
} from "native-base";
import { Row } from "react-native-easy-grid";
import CategoryButton from "./CategoryButton";
import { CATEGORIES } from "../constants";

class Categories extends Component {
	state = {
		selectedCategories: [],
	};

	componentDidMount = () => {};

	componentDidUpdate = () => {};

	addCategoriesToSession = () => {
		this.props.updateSessionConfigurable(this.state.selectedCategories);
	};

	onCategorySelect = (category, shouldAdd) => {
		let newCategories;
		if (shouldAdd) {
			newCategories = [...this.state.selectedCategories, category];
		} else {
			newCategories = this.state.selectedCategories.filter(
				(originalCategory) => {
					return originalCategory !== category;
				}
			);
		}

		this.setState({
			selectedCategories: newCategories,
		});
	};

	renderCategories = () => {
		const categories = Object.values(CATEGORIES);
		const rows = [...Array(Math.ceil(categories.length / 4))];
		const categoriesByRow = rows.map((row, i) => {
			return categories.slice(i * 4, i * 4 + 4);
		});

		return categoriesByRow.map((categoryRow, i) => {
			return (
				<Row style={{ margin: 10 }}>
					{categoryRow.map((category) => {
						return (
							<Col>
								<CategoryButton
									category={category}
									onSelect={this.onCategorySelect}
								/>
							</Col>
						);
					})}
				</Row>
			);
		});
	};

	renderSelectedCategories = () => {
		return (
			<Text>
				{this.state.selectedCategories.map((selectedCategory) => {
					return `${selectedCategory}, `;
				})}
			</Text>
		);
	};

	render() {
		return (
			<Container>
				<Header>
					<Left>
						<Button transparent onPress={() => this.props.goBack()}>
							<Icon name="arrow-back" />
						</Button>
					</Left>
					<Body>
						<Title>Categories</Title>
					</Body>
					<Right>
						<Button hasText transparent>
							<Text>Cancel</Text>
						</Button>
					</Right>
				</Header>
				<Content>{this.renderCategories()}</Content>
				<Footer>
					<Left>{this.renderSelectedCategories()}</Left>
					<Right>
						<Button onPress={this.addCategoriesToSession}>
							<Text>Add Categories</Text>
						</Button>
					</Right>
				</Footer>
			</Container>
		);
	}
}

export default Categories;
