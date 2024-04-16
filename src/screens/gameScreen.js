import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
	StyleSheet,
	Text,
	SafeAreaView,
	View,
	ScrollView,
	Alert,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import { useFonts } from "expo-font";
import Animated, {
	SlideInLeft,
	SlideInDown,
	ZoomIn,
	FlipInEasyY,
} from "react-native-reanimated";

import { colors, CLEAR, ENTER, colorsToEmoji, words } from "../constants";
import BackButton from "../components/BackBtn";
import LeaderboardButton from "../components/Leaderboard";
import HoveringText from "../components/Keyboard/HoveringText";
import Keyboard from "../components/Keyboard/Keyboard";

//Number of words player can guess
const NUM_TRIES = 6;

const copyArray = (arr) => {
	return [...arr.map((rows) => [...rows])];
}; //Deep copy of array

function getDayOfYear() {
	const now = new Date();
	const startOfYear = new Date(now.getFullYear(), 0, 0);
	const diff = now - startOfYear;
	const oneDay = 1000 * 60 * 60 * 24;
	const dayOfYear = Math.floor(diff / oneDay);
	return dayOfYear;
} //Gets numbered day of year for word array

function getTodaysWord(words) {
	const dayOfYear = getDayOfYear();
	return words[dayOfYear];
} //Gets word of the day

export default function GameScreen({ navigation }) {
	// AsyncStorage.removeItem("gameData");
	// AsyncStorage.removeItem("gameStats");
	const [fontsLoaded] = useFonts({
		stones: require("../../assets/stones.otf"),
	}); //Load custom font

	if (!fontsLoaded) {
		return null;
	}

	const [word, setWord] = useState(getTodaysWord(words));
	const [letters, setLetters] = useState(word.split(""));
	const [dayOfYear, setDayOfYear] = useState(getDayOfYear());

	const [rows, setRows] = useState(
		new Array(NUM_TRIES).fill(new Array(letters.length).fill(""))
	);
	const [curRow, setCurRow] = useState(0);
	const [curCol, setCurCol] = useState(0);
	const [gameState, setGameState] = useState("playing"); //Won, lost, playing
	const [loaded, setLoaded] = useState(false);
	const [invalidWord, setInvalidWord] = useState(false);
	const [gameOver, setGameOver] = useState(false);

	useEffect(() => {
		// Check game state only if the game has started
		if (curRow > 0 && gameState === "playing") {
			checkGameState();
		}
	}, [curRow, gameState]);

	useEffect(() => {
		//Load game data
		if (loaded) {
			saveGame();
		}
	}, [rows, curRow, curCol, gameState]);

	useEffect(() => {
		//Read data at start
		readData();
	}, []);

	const saveGame = async () => {
		const gameData = {
			rows,
			curRow,
			curCol,
			gameState,
			word,
			dayOfYear,
		};

		const dataString = JSON.stringify(gameData);
		await AsyncStorage.setItem("gameData", dataString);
	}; //Save game data

	const readData = async () => {
		const dataString = await AsyncStorage.getItem("gameData");

		try {
			const gameData = JSON.parse(dataString);
			if (gameData) {
				setRows(gameData.rows);
				setCurRow(gameData.curRow);
				setCurCol(gameData.curCol);
				setGameState(gameData.gameState);
				if (gameData.dayOfYear !== dayOfYear) {
					AsyncStorage.removeItem("gameData");
					setRows(
						new Array(NUM_TRIES).fill(new Array(letters.length).fill(""))
					);
					setCurRow(0);
					setCurCol(0);
					setGameState("playing");
				}
			}
		} catch (error) {
			console.error("Error reading data: ", error);
		}
		setLoaded(true);
	}; //Read game data, if null, create empty data

	const checkGameState = () => {
		if (checkIfWon() && gameState !== "won") {
			setGameState("won");
			updateGameStats();
			setTimeout(() => {
				setGameOver(true);
			}, 1000);
		} else if (checkIfLost() && gameState !== "lost") {
			setGameState("lost");
			updateGameStats();
			setTimeout(() => {
				setGameOver(true);
			}, 1000);
		}
	}; //check if player has won or lost

	const updateGameStats = async () => {
		try {
			const today = new Date().toLocaleDateString();
			let gameStats = await AsyncStorage.getItem("gameStats");

			if (!gameStats) {
				gameStats = {
					games: 1,
					lastDate: today,
					dist: new Array(NUM_TRIES).fill(0),
				};
				if (checkIfWon()) {
					gameStats.gamesWon = 1;
					gameStats.streak = 1;
					gameStats.best = 1;
					gameStats.dist[curRow - 1] = 1;
				} else {
					gameStats.gamesWon = 0;
					gameStats.streak = 0;
					gameStats.best = 0;
					gameStats.dist[curRow - 1] = 0;
				}
			} else {
				gameStats = JSON.parse(gameStats);
				if (gameStats.lastDate !== today) {
					gameStats.games += 1;
					if (checkIfWon()) {
						gameStats.gamesWon += 1;
						gameStats.streak += 1;
						gameStats.dist[curRow - 1]++;
						if (gameStats.streak > gameStats.best) {
							gameStats.best = gameStats.streak;
						}
					} else {
						gameStats.streak = 0;
					}
					gameStats.lastDate = today;
				}
			}
			await AsyncStorage.setItem("gameStats", JSON.stringify(gameStats));
		} catch (error) {
			console.error("Error updating game stats: ", error);
		}
	}; //Update game stats

	const checkIfWon = () => {
		const row = rows[curRow - 1];

		return row.every((letter, i) => letter === letters[i]);
	}; //Check if player guessed word

	const checkIfLost = () => {
		return !checkIfWon() && curRow === rows.length;
	}; //Check if player ran out of turns

	const shareScore = () => {
		const textMap = rows
			.map((row, i) =>
				row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join("")
			)
			.filter((row) => row)
			.join("\n");

		const currentDate = new Date();
		const dateString =
			(currentDate.getMonth() + 1).toString().padStart(2, "0") +
			"/" +
			currentDate.getDate().toString().padStart(2, "0") +
			"/" +
			currentDate.getFullYear().toString();

		const textToShare = `Word Whirl - ${dateString}\n${textMap}`;
		Clipboard.setString(textToShare);
		let newGameState = gameState;
		if (checkIfWon()) {
			newGameState = "won";
		} else if (checkIfLost()) {
			newGameState = "lost";
		}
		Alert.alert("Score copied to clipboard!");
		navigation.navigate("Score");
	}; //Get game data and copy to clipboard

	const onKeyPressed = async (key) => {
		if (gameState !== "playing") {
			return;
		}

		const updatedRows = copyArray(rows);

		if (key === CLEAR) {
			const prevCol = curCol - 1;
			if (prevCol >= 0) {
				updatedRows[curRow][prevCol] = "";
				setRows(updatedRows);
				setCurCol(prevCol);
			}
			return;
		}

		if (key === ENTER) {
			if (curCol === letters.length) {
				// Ensure full word is entered
				const currentWord = updatedRows[curRow].join("");
				const isValid = await checkWord(currentWord);
				if (isValid) {
					// Proceed to the next row if the word is valid
					setCurRow(curRow + 1);
					setCurCol(0);
				} else {
					// Clear the current row and allow the user to try again
					updatedRows[curRow] = new Array(letters.length).fill("");
					setRows(updatedRows);
					setCurCol(0);
					setInvalidWord(true);
					setTimeout(() => setInvalidWord(false), 2000);
				}
			}
			return;
		}

		if (curCol < rows[0].length) {
			const currentCell = updatedRows[curRow][curCol];
			if (currentCell === "" || letters.includes(currentCell)) {
				updatedRows[curRow][curCol] = key;
				setRows(updatedRows);
				setCurCol(curCol + 1);
			}
		}
	}; //Handle keyboard interactions

	const isCellActive = (row, col) => {
		return row === curRow && col === curCol;
	}; //Find active cell

	const getCellBGColor = (row, col) => {
		const letter = rows[row][col];

		if (row >= curRow) {
			return colors.black;
		}
		if (letter === letters[col]) {
			return colors.primary;
		}
		if (letters.includes(letter)) {
			return colors.secondary;
		}
		return colors.darkgrey;
	}; //Change bg color of cells on board

	const getAllLettersWithColor = (color) => {
		return rows.flatMap((row, i) =>
			row.filter((cell, j) => getCellBGColor(i, j) === color)
		);
	}; //Find all the letters on board with color

	const greenCaps = getAllLettersWithColor(colors.primary);
	const yellowCaps = getAllLettersWithColor(colors.secondary);
	const greyCaps = getAllLettersWithColor(colors.darkgrey);

	const getCellStyles = (rowIndex, cellIndex) => [
		styles.cell,
		{
			borderColor: isCellActive(rowIndex, cellIndex)
				? colors.lightgrey
				: colors.grey,
			backgroundColor: getCellBGColor(rowIndex, cellIndex),
		},
	];

	const checkWord = async (word) => {
		const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
		try {
			const response = await fetch(apiUrl);
			const data = await response.json();
			return Array.isArray(data) && data.length > 0;
		} catch (error) {
			console.error("Error fetching data: ", error);
			return false;
		}
	}; //Check if word is valid with dictionary API

	if (!loaded) {
		return <ActivityIndicator />;
	}

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style="light" />
			<View style={styles.header}>
				<View style={styles.titleContainer}>
					<BackButton onPress={() => navigation.goBack()} />
					<Text style={styles.title}>Word </Text>
					<Text style={[styles.title, styles.titleSecondary]}>Whirl</Text>
					<LeaderboardButton onPress={() => navigation.navigate("Score")} />
				</View>
			</View>
			<ScrollView style={styles.map}>
				{rows.map((row, rowIndex) => (
					<Animated.View
						entering={SlideInLeft.delay(rowIndex * 50)}
						key={`row-${rowIndex}`}
						style={styles.row}
					>
						{row.map((letter, cellIndex) => (
							<React.Fragment key={`cell-fragment-${rowIndex}-${cellIndex}`}>
								{rowIndex < curRow && (
									<Animated.View
										entering={FlipInEasyY.delay(cellIndex * 100)}
										key={`cell-color-${rowIndex}-${cellIndex}`}
										style={getCellStyles(rowIndex, cellIndex)}
									>
										<Text style={styles.cellText}>{letter.toUpperCase()}</Text>
									</Animated.View>
								)}
								{rowIndex === curRow && !!letter && (
									<Animated.View
										entering={ZoomIn}
										key={`cell-active-${rowIndex}-${cellIndex}`}
										style={getCellStyles(rowIndex, cellIndex)}
									>
										<Text style={styles.cellText}>{letter.toUpperCase()}</Text>
									</Animated.View>
								)}
								{!letter && (
									<View
										key={`cell-empty-${rowIndex}-${cellIndex}`}
										style={getCellStyles(rowIndex, cellIndex)}
									>
										<Text style={styles.cellText}>{letter.toUpperCase()}</Text>
									</View>
								)}
							</React.Fragment>
						))}
					</Animated.View>
				))}
			</ScrollView>
			{!gameOver && (
				<React.Fragment>
					<Keyboard
						onKeyPressed={onKeyPressed}
						greenCaps={greenCaps}
						yellowCaps={yellowCaps}
						greyCaps={greyCaps}
					/>
					<HoveringText visible={invalidWord} message="Not in word list!" />
				</React.Fragment>
			)}
			{gameOver && (
				<Animated.View
					entering={SlideInDown.delay(500)}
					style={styles.shareContainer}
				>
					<Text style={styles.shareText}>
						{gameState === "won" ? "Congrats!" : "Bummer!"}
					</Text>
					<Text style={styles.shareTextWord}>
						The word was:{" "}
						<Text style={{ color: colors.white }}>{word.toUpperCase()}</Text>
					</Text>
					<View style={styles.btnContainer}>
						<TouchableOpacity
							style={styles.button}
							title="Share"
							onPress={shareScore}
						>
							<Text style={styles.buttonText}>Share</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.button}
							title="No thanks"
							onPress={() => navigation.navigate("Score")}
						>
							<Text style={styles.buttonText}>Scores</Text>
						</TouchableOpacity>
					</View>
				</Animated.View>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.black,
		alignItems: "center",
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	title: {
		color: colors.primary,
		fontSize: 32,
		fontWeight: "bold",
		letterSpacing: 5,
		fontFamily: "stones",
	},
	titleSecondary: {
		color: colors.secondary,
		fontFamily: "stones",
	},
	map: {
		alignSelf: "stretch",
		height: 100,
		marginVertical: 30,
		marginLeft: 20,
	},
	row: {
		alignSelf: "stretch",
		flexDirection: "row",
		marginVertical: 5,
	},
	cell: {
		margin: 4,
		flex: 1,
		aspectRatio: 1,
		maxWidth: 70,

		justifyContent: "center",
		alignItems: "center",

		borderWidth: 1,
		borderColor: colors.lightgrey,
	},
	cellText: {
		color: colors.white,
		fontWeight: "bold",
		fontSize: 28,
		fontFamily: "stones",
	},
	shareContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-start",
		marginBottom: 20,
	},
	shareText: {
		color: colors.primary,
		fontSize: 36,
		fontFamily: "stones",
		marginBottom: 20,
	},
	shareTextWord: {
		color: colors.secondary,
		fontSize: 30,
		fontFamily: "stones",
		marginBottom: 20,
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
