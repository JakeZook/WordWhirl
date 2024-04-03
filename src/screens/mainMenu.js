import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../constants";

function MainMenu({ navigation }) {
	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Text>
					<Text style={styles.title}>Word </Text>
					<Text style={[styles.title, styles.titleSecondary]}>Whirl</Text>
				</Text>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.button}
						onPress={() => navigation.navigate("GameScreen")}
					>
						<Text style={styles.buttonText}>Start Game</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.secondButton}
						onPress={() => navigation.navigate("Score")}
					>
						<Text style={styles.buttonText}>Scores</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.secondButton}
						onPress={() => navigation.navigate("HowToPlay")}
					>
						<Text style={styles.buttonText}>How to Play</Text>
					</TouchableOpacity>
				</View>
			</View>
			<Text style={styles.footerText}>Created by Jake Zook</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.black,
		paddingBottom: 20,
	},
	content: {
		alignItems: "center",
	},
	title: {
		fontSize: 64,
		color: colors.primary,
	},
	titleSecondary: {
		color: colors.secondary,
	},
	buttonContainer: {
		alignItems: "center",
	},
	button: {
		backgroundColor: colors.primary,
		padding: 10,
		borderRadius: 5,
		marginTop: 20,
		width: 200, // Adjust the width as needed
	},
	secondButton: {
		backgroundColor: colors.secondary,
		padding: 10,
		borderRadius: 5,
		marginTop: 20,
		width: 200, // Adjust the width as needed
	},
	buttonText: {
		color: colors.white,
		fontSize: 28,
		textAlign: "center",
	},
	footerText: {
		position: "absolute",
		bottom: 30,
		color: colors.lightgrey,
		fontSize: 16,
	},
});

export default MainMenu;
