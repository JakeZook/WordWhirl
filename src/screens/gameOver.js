import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useFonts } from "expo-font";

import { colors } from "../constants";

const totalGames = 48;
const guessDB = [1, 2, 4, 8, 15, 28];
const completion = [];
for (let i = 0; i < guessDB.length; i++) {
	completion[i] = (guessDB[i] / totalGames) * 100;
}

const GameOver = ({ navigation }) => {
	const [fontsLoaded] = useFonts({
		stones: require("../../assets/stones.otf"),
	});

	if (!fontsLoaded) {
		return null;
	}

	const route = useRoute();
	const { word, gameState, curRow } = route.params;

	const message = gameState === "won" ? "Congrats!" : "Bummer!";

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{message}</Text>
			<Text style={styles.subTitle}>
				The word was:{" "}
				<Text style={{ color: colors.white }}>{word.toUpperCase()}</Text>
			</Text>
			<View style={styles.stats}>
				<View style={styles.statsContainer}>
					<Text style={styles.statsText}>5</Text>
					<Text style={styles.statsText}>Games</Text>
				</View>
				<View style={styles.statsContainer}>
					<Text style={styles.statsText}>5</Text>
					<Text style={styles.statsText}>Wins</Text>
				</View>
				<View style={styles.statsContainer}>
					<Text style={styles.statsText}>5</Text>
					<Text style={styles.statsText}>Streak</Text>
				</View>
				<View style={styles.statsContainer}>
					<Text style={styles.statsText}>5</Text>
					<Text style={styles.statsText}>Best</Text>
				</View>
			</View>
			<Text style={styles.guessDistTitle}>Guess Distribution:</Text>
			<View style={styles.guessDist}>
				<View style={styles.guessRow}>
					<View style={styles.cellContainer}>
						<Text style={styles.cell}>1</Text>
					</View>
					<View style={styles.progressBarContainer}>
						<View
							style={[styles.progressBar, { width: `${completion[0]}%` }]}
						/>
					</View>
					<View>
						<Text style={styles.statsText}>5</Text>
					</View>
				</View>
				<View style={styles.guessRow}>
					<View style={styles.cellContainer}>
						<Text style={styles.cell}>2</Text>
					</View>
					<View style={styles.progressBarContainer}>
						<View
							style={[styles.progressBar, { width: `${completion[1]}%` }]}
						/>
					</View>
					<View>
						<Text style={styles.statsText}>5</Text>
					</View>
				</View>
				<View style={styles.guessRow}>
					<View style={styles.cellContainer}>
						<Text style={styles.cell}>3</Text>
					</View>
					<View style={styles.progressBarContainer}>
						<View
							style={[styles.progressBar, { width: `${completion[2]}%` }]}
						/>
					</View>
					<View>
						<Text style={styles.statsText}>5</Text>
					</View>
				</View>
				<View style={styles.guessRow}>
					<View style={styles.cellContainer}>
						<Text style={styles.cell}>4</Text>
					</View>
					<View style={styles.progressBarContainer}>
						<View
							style={[styles.progressBar, { width: `${completion[3]}%` }]}
						/>
					</View>
					<View>
						<Text style={styles.statsText}>5</Text>
					</View>
				</View>
				<View style={styles.guessRow}>
					<View style={styles.cellContainer}>
						<Text style={styles.cell}>5</Text>
					</View>
					<View style={styles.progressBarContainer}>
						<View
							style={[styles.progressBar, { width: `${completion[4]}%` }]}
						/>
					</View>
					<View>
						<Text style={styles.statsText}>5</Text>
					</View>
				</View>
				<View style={styles.guessRow}>
					<View style={styles.cellContainer}>
						<Text style={styles.cell}>6</Text>
					</View>
					<View style={styles.progressBarContainer}>
						<View
							style={[styles.progressBar, { width: `${completion[5]}%` }]}
						/>
					</View>
					<View>
						<Text style={styles.statsText}>5</Text>
					</View>
				</View>
			</View>
			<TouchableOpacity
				style={styles.button}
				onPress={() => navigation.navigate("MainMenu")}
			>
				<Text style={styles.buttonText}>Menu</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
		backgroundColor: colors.black,
	},
	title: {
		marginTop: 100,
		fontSize: 38,
		color: colors.primary,
		fontFamily: "stones",
	},
	subTitle: {
		fontSize: 28,
		color: colors.secondary,
		fontFamily: "stones",
	},
	stats: {
		flexDirection: "row",
		paddingBottom: 5,
		borderBottomWidth: 2,
		borderBottomColor: colors.primary,
	},
	statsContainer: {
		margin: 10,
		marginTop: 25,
		flexDirection: "column",
		alignItems: "center",
	},
	statsText: {
		color: colors.white,
		fontSize: 20,
		margin: 10,
		fontFamily: "stones",
	},
	guessDist: {
		marginTop: 30,
		marginBottom: 10,
		marginHorizontal: 20,
		display: "flex",
		alignItems: "flex-start",
	},
	guessDistTitle: {
		marginTop: 30,
		fontSize: 28,
		color: colors.white,
		fontFamily: "stones",
	},
	guessRow: {
		marginVertical: 10,
		flexDirection: "row",
		alignItems: "center",
	},
	cellContainer: {
		backgroundColor: colors.darkgrey,
		padding: 10,
		borderRadius: 5,
		marginRight: 10,
		borderWidth: 1,
		borderColor: colors.lightgrey,
	},
	cell: {
		color: colors.white,
		fontSize: 24,
	},
	progressBarContainer: {
		flex: 1,
	},
	progressBar: {
		height: 10,
		backgroundColor: colors.primary,
		borderRadius: 5,
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
		fontFamily: "stones",
	},
});

export default GameOver;
