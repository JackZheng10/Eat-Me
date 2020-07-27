import React, { Component } from "react";
import { View } from "react-native";
import { Header, Icon } from "react-native-elements";
import ModalStyles from "../styles/ModalStyles";

class CreateSessionHeader extends Component {
	renderCategoryHeadLeft = () => {
		return <Icon onPress={this.props.goBack} name="arrow-back" color="#FFF" />;
	};

	renderCategoryHeadRight = () => {
		return <Icon name="clear" onPress={this.props.exit} color="#FFF" />;
	};

	render() {
		return (
			<View style={{ flex: 1 }}>
				<Header
					containerStyle={{ backgroundColor: "#00B2CA" }}
					leftComponent={this.renderCategoryHeadLeft}
					centerComponent={{
						text: this.props.title,
						style: ModalStyles.headerCenterText,
					}}
					rightComponent={this.renderCategoryHeadRight}
				/>
			</View>
		);
	}
}

export default CreateSessionHeader;
