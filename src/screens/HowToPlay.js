import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../constants";

function HowToPlay({ navigation }) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>How to Play</Text>
			<Text style={styles.description}>
				The goal of the game is to guess a 5-letter word in six guesses or less.
				You can only guess English words. Once a word is guessed, the letters in
				the word will change color depending on their placement in the word.
			</Text>
			<View style={styles.example}>
				<View style={styles.letterContainer}>
					<Text style={styles.letter}>A</Text>
				</View>
				<Text style={styles.exampleText}>The letter is not in the word</Text>
			</View>
			<View style={styles.example}>
				<View style={[styles.letterContainer, styles.yellow]}>
					<Text style={styles.letter}>B</Text>
				</View>
				<Text style={styles.exampleText}>
					The letter is in the word, but not in the right spot
				</Text>
			</View>
			<View style={styles.example}>
				<View style={[styles.letterContainer, styles.green]}>
					<Text style={styles.letter}>C</Text>
				</View>
				<Text style={styles.exampleText}>
					The letter is in the word and in the right spot
				</Text>
			</View>
			<TouchableOpacity
				style={styles.button}
				onPress={() => navigation.goBack()}
			>
				<Text style={styles.buttonText}>Go Back</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.black,
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 32,
		color: colors.primary,
		marginBottom: 20,
	},
	description: {
		color: colors.white,
		textAlign: "center",
		marginBottom: 20,
		fontSize: 20,
	},
	button: {
		backgroundColor: colors.secondary,
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
	},
	buttonText: {
		color: colors.white,
		fontSize: 28,
	},
	example: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	letterContainer: {
		backgroundColor: colors.darkgrey,
		padding: 10,
		borderRadius: 5,
		marginRight: 10,
		borderWidth: 1,
		borderColor: colors.lightgrey,
	},
	letter: {
		color: colors.white,
		fontSize: 28,
	},
	exampleText: {
		color: colors.white,
		fontSize: 20,
		flex: 1,
	},
	yellow: {
		backgroundColor: colors.secondary,
	},
	green: {
		backgroundColor: colors.primary,
	},
});

export default HowToPlay;
