import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../constants";
import { useFonts } from "expo-font";

function MainMenu({ navigation }) {
	const [fontsLoaded] = useFonts({
		stones: require("../../assets/stones.otf"),
	}); // Load custom font

	if (!fontsLoaded) {
		return null;
	}

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Text>
					<Text style={styles.title}>Wordy </Text>
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
		fontFamily: "stones",
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
		width: 200,
	},
	secondButton: {
		backgroundColor: colors.secondary,
		padding: 10,
		borderRadius: 5,
		marginTop: 20,
		width: 200,
	},
	buttonText: {
		color: colors.white,
		fontSize: 28,
		textAlign: "center",
		fontFamily: "stones",
	},
	footerText: {
		position: "absolute",
		bottom: 30,
		color: colors.lightgrey,
		fontSize: 16,
	},
});

export default MainMenu;
