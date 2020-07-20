import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Header, Icon, Button } from "react-native-elements";
import CategoryButton from "./CategoryButton";
import { CATEGORIES } from "../../constants";
import ModalStyles from "./styles/ModalStyles";

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

		return (
			<View style={styles.categoriesRow}>
				{categoriesByRow.map((categoryRow, i) => {
					return (
						<View key={i} style={styles.categoryView}>
							{categoryRow.map((category) => {
								return (
									<CategoryButton
										key={category}
										category={category}
										onSelect={this.onCategorySelect}
									/>
								);
							})}
						</View>
					);
				})}
			</View>
		);
	};

	renderCategoryHeadLeft = () => {
		return <Icon onPress={this.props.goBack} name="arrow-back" color="#FFF" />;
	};

	renderCategoryHeadRight = () => {
		//Consider Screen sizes for these elements
		return <Icon name="clear" onPress={this.props.exit} color="#FFF" />;
	};

	render() {
		return (
			<View style={{ flex: 1 }}>
				<View style={{ flex: 1 }}>
					<Header
						containerStyle={{ backgroundColor: "#00B2CA" }}
						leftComponent={this.renderCategoryHeadLeft}
						centerComponent={{
							text: "Select Categories",
							style: ModalStyles.headerCenterText,
						}}
						rightComponent={this.renderCategoryHeadRight}
					/>
				</View>
				<View style={ModalStyles.content}>{this.renderCategories()}</View>
				<View style={ModalStyles.footer}>
					<Button
						onPress={this.addCategoriesToSession}
						buttonStyle={ModalStyles.updateSessionButton}
						title="Add Categories"
					/>
				</View>
			</View>
		);
	}
}

export default Categories;
