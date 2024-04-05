import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";

import { colors } from "../constants";

const GameOver = ({ navigation }) => {
	const [stats, setStats] = useState({});
	const [countdown, setCountdown] = useState("");

	const [fontsLoaded] = useFonts({
		stones: require("../../assets/stones.otf"),
	});

	useEffect(() => {
		getStats();
	}, []);

	useEffect(() => {
		updateCountdown();
		const intervalId = setInterval(updateCountdown, 1000);

		return () => clearInterval(intervalId);
	}, []);

	async function getStats() {
		const gameStats = await AsyncStorage.getItem("gameStats");
		setStats(JSON.parse(gameStats));
	}

	const updateCountdown = () => {
		const now = new Date();
		const tomorrow = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate() + 1
		);
		const diff = tomorrow - now;

		let hours = Math.floor(diff / (1000 * 60 * 60));
		let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((diff % (1000 * 60)) / 1000);

		const formatted = `${hours.toString().padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
		setCountdown(formatted);
	};

	const shareScore = () => {
		const message = `Games played: ${stats.games}\nGames won: ${stats.gamesWon}\nStreak: ${stats.streak}\nBest streak: ${stats.best}\n\nGuess distribution:\n${stats.dist}`;
		Clipboard.setStringAsync(message);
		Alert.alert("Score copied to clipboard!");
	};

	if (!fontsLoaded) {
		return null;
	}

	const route = useRoute();
	const { word, gameState } = route.params;

	const message = gameState === "won" ? "Congrats!" : "Bummer!";

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{message}</Text>
			<Text style={styles.subTitle}>
				The word was:{" "}
				<Text style={{ color: colors.white }}>{word.toUpperCase()}</Text>
			</Text>
			<View>
				<Text style={styles.countdown}>Next Word in:</Text>
				<Text style={styles.countdown}>{countdown}</Text>
			</View>
			<View style={styles.stats}>
				<View style={styles.statsContainer}>
					<Text style={styles.statsText}>{stats.games}</Text>
					<Text style={styles.statsText}>Games</Text>
				</View>
				<View style={styles.statsContainer}>
					<Text style={styles.statsText}>{stats.gamesWon}</Text>
					<Text style={styles.statsText}>Wins</Text>
				</View>
				<View style={styles.statsContainer}>
					<Text style={styles.statsText}>{stats.streak}</Text>
					<Text style={styles.statsText}>Streak</Text>
				</View>
				<View style={styles.statsContainer}>
					<Text style={styles.statsText}>{stats.best}</Text>
					<Text style={styles.statsText}>Best</Text>
				</View>
			</View>
			<Text style={styles.guessDistTitle}>Guess Distribution:</Text>
			<View style={styles.guessDist}>
				{stats.dist &&
					stats.dist.map((e, index) => (
						<View key={index} style={styles.guessRow}>
							<View style={styles.cellContainer}>
								<Text style={styles.cell}>{index + 1}</Text>
							</View>
							<View style={styles.progressBarContainer}>
								<View
									style={[
										styles.progressBar,
										{ width: `${(e / stats.games) * 100}%` },
									]}
								/>
							</View>
							<View>
								<Text style={styles.statsText}>{stats.dist[index]}</Text>
							</View>
						</View>
					))}
			</View>
			<View style={styles.btnContainer}>
				<TouchableOpacity
					style={styles.button}
					onPress={() => navigation.navigate("MainMenu")}
				>
					<Text style={styles.buttonText}>Menu</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.button} onPress={() => shareScore()}>
					<Text style={styles.buttonText}>Share</Text>
				</TouchableOpacity>
			</View>
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
		marginTop: 50,
		fontSize: 38,
		color: colors.primary,
		fontFamily: "stones",
	},
	subTitle: {
		fontSize: 28,
		color: colors.secondary,
		fontFamily: "stones",
		paddingBottom: 5,
	},
	countdown: {
		fontSize: 18,
		color: colors.white,
		fontFamily: "stones",
		textAlign: "center",
	},
	stats: {
		flexDirection: "row",
		paddingBottom: 5,
		borderBottomWidth: 2,
		borderBottomColor: colors.primary,
	},
	statsContainer: {
		margin: 10,
		marginTop: 5,
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
	btnContainer: {
		flexDirection: "row",
		marginTop: 10,
	},
	button: {
		backgroundColor: colors.secondary,
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
		marginHorizontal: 20,
	},
	buttonText: {
		color: colors.white,
		fontSize: 28,
		fontFamily: "stones",
	},
});

export default GameOver;
