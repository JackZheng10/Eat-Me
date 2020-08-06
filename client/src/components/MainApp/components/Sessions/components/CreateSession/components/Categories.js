import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import CategoryButton from "./CategoryButton";
import { CATEGORIES } from "../../../../../../../constants";
import ModalStyles from "../styles/ModalStyles";
import CreateSessionHeader from "./CreateSessionHeader";
import CreateSessionFooter from "./CreateSessionFooter";

const styles = StyleSheet.create({
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

class Categories extends Component {
	state = {
		selectedCategories: [...this.props.selectedCategories],
	};

	addCategoriesToSession = () => {
		if (this.state.selectedCategories.length > 0) {
			this.props.updateSessionConfigurable(this.state.selectedCategories);
		} else {
			//Future Toast Message
			alert("Select some categories");
		}
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

	//4 is used to determine how many categories are in a row
	renderCategories = () => {
		const categories = Object.values(CATEGORIES);
		const rows = [...Array(Math.ceil(categories.length / 4))];
		const categoriesByRow = rows.map((row, i) => {
			return categories.slice(i * 4, i * 4 + 4);
		});

		return (
			<View style={styles.categoriesRow}>
				{categoriesByRow.map((categoryRow, i) => {
					return (
						<View key={i} style={styles.categoryView}>
							{categoryRow.map((category) => {
								const selected = this.determineSelectedStatus(category);
								return (
									<CategoryButton
										key={category.name}
										category={category}
										onSelect={this.onCategorySelect}
										selected={selected}
									/>
								);
							})}
						</View>
					);
				})}
			</View>
		);
	};

	determineSelectedStatus = (category) => {
		return this.state.selectedCategories.includes(category);
	};

	render() {
		return (
			<View style={{ flex: 1 }}>
				<CreateSessionHeader
					goBack={this.props.goBack}
					exit={this.props.exit}
					title="Select Categories"
				/>
				<View style={ModalStyles.content}>{this.renderCategories()}</View>
				<CreateSessionFooter
					updateSession={this.addCategoriesToSession}
					title="Add Categories"
				/>
			</View>
		);
	}
}

export default Categories;
