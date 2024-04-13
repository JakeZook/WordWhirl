import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../constants";

//Text to hover on game screen when a word is invalid
const HoveringText = ({ visible, message }) => {
	if (!visible) {
		return null;
	}

	return (
		<View style={styles.container}>
			<Text style={styles.text}>{message}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		top: 100,
		alignSelf: "center",
		backgroundColor: colors.white,
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 10,
	},
	text: {
		color: colors.black,
		fontSize: 20,
	},
});

export default HoveringText;
