import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
	StyleSheet,
	Text,
	SafeAreaView,
	View,
	ScrollView,
	Alert,
	ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";

import { colors, CLEAR, ENTER, colorsToEmoji, words } from "../constants";
import BackButton from "../components/BackBtn";
import LeaderboardButton from "../components/Leaderboard";
import HoveringText from "../components/Keyboard/HoveringText";
import Keyboard from "../components/Keyboard/Keyboard";

const NUM_TRIES = 6;

const copyArray = (arr) => {
	return [...arr.map((rows) => [...rows])];
};

function getTodaysWord(words) {
	const now = new Date();
	const startOfYear = new Date(now.getFullYear(), 0, 0);
	const diff = now - startOfYear;
	const oneDay = 1000 * 60 * 60 * 24;
	const dayOfYear = Math.floor(diff / oneDay);

	return words[dayOfYear];
}

export default function GameScreen({ navigation }) {
	// AsyncStorage.removeItem("gameData");
	const [word, setWord] = useState(getTodaysWord(words));
	const [letters, setLetters] = useState(word.split(""));

	const [rows, setRows] = useState(
		new Array(NUM_TRIES).fill(new Array(letters.length).fill(""))
	);
	const [curRow, setCurRow] = useState(0);
	const [curCol, setCurCol] = useState(0);
	const [gameState, setGameState] = useState("playing"); //Won, lost, playing
	const [loaded, setLoaded] = useState(false);
	const [invalidWord, setInvalidWord] = useState(false);

	useEffect(() => {
		// Check game state only if the game has started
		if (curRow > 0 && gameState === "playing") {
			checkGameState();
		}
	}, [curRow, gameState]);

	useEffect(() => {
		if (loaded) {
			saveGame();
		}
	}, [rows, curRow, curCol, gameState]);

	useEffect(() => {
		readData();
	}, []);

	const saveGame = async () => {
		const gameData = {
			rows,
			curRow,
			curCol,
			gameState,
		};

		const dataString = JSON.stringify(gameData);
		await AsyncStorage.setItem("gameData", dataString);
	};

	const readData = async () => {
		const dataString = await AsyncStorage.getItem("gameData");

		try {
			const gameData = JSON.parse(dataString);
			if (gameData) {
				setRows(gameData.rows);
				setCurRow(gameData.curRow);
				setCurCol(gameData.curCol);
				setGameState(gameData.gameState);
			}
		} catch (error) {
			console.error("Error reading data: ", error);
		}
		setLoaded(true);
	};

	const checkGameState = () => {
		if (checkIfWon() && gameState !== "won") {
			setGameState("won");
			Alert.alert("You won!", "Share your score?", [
				{ text: "Share", onPress: shareScore },
				{ text: "No thanks", onPress: () => goToEndScreen("won") },
			]);
		} else if (checkIfLost() && gameState !== "lost") {
			setGameState("lost");
			Alert.alert("You lost!", "Share your score?", [
				{ text: "Share", onPress: shareScore },
				{ text: "No thanks", onPress: () => goToEndScreen("lost") },
			]);
		}
	};

	const goToEndScreen = (gameState) => {
		navigation.navigate("GameOver", {
			word: word,
			gameState: gameState,
			curRow: curRow,
		});
	};

	const checkIfWon = () => {
		const row = rows[curRow - 1];

		return row.every((letter, i) => letter === letters[i]);
	};

	const checkIfLost = () => {
		return !checkIfWon() && curRow === rows.length;
	};

	const shareScore = () => {
		const textMap = rows
			.map((row, i) =>
				row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join("")
			)
			.filter((row) => row)
			.join("\n");

		const textToShare = `Word Whirl - ${word}\n${textMap}`;
		Clipboard.setString(textToShare);
		let newGameState = gameState;
		if (checkIfWon()) {
			newGameState = "won";
		} else if (checkIfLost()) {
			newGameState = "lost";
		}
		Alert.alert("Copied to clipboard!", "Continue to end screen?", [
			{ text: "OK", onPress: () => goToEndScreen(newGameState) },
		]);
	};

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
	};

	const isCellActive = (row, col) => {
		return row === curRow && col === curCol;
	};

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
	};

	const getAllLettersWithColor = (color) => {
		return rows.flatMap((row, i) =>
			row.filter((cell, j) => getCellBGColor(i, j) === color)
		);
	};

	const greenCaps = getAllLettersWithColor(colors.primary);
	const yellowCaps = getAllLettersWithColor(colors.secondary);
	const greyCaps = getAllLettersWithColor(colors.darkgrey);

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
	};

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
					<LeaderboardButton onPress={() => navigation.goBack()} />
				</View>
			</View>
			<ScrollView style={styles.map}>
				{rows.map((row, rowIndex) => (
					<View key={`row-${rowIndex}`} style={styles.row}>
						{row.map((letter, cellIndex) => (
							<View
								key={`cell-${rowIndex}-${cellIndex}`}
								style={[
									styles.cell,
									{
										borderColor: isCellActive(rowIndex, cellIndex)
											? colors.lightgrey
											: colors.grey,
										backgroundColor: getCellBGColor(rowIndex, cellIndex),
									},
								]}
							>
								<Text style={styles.cellText}>{letter.toUpperCase()}</Text>
							</View>
						))}
					</View>
				))}
			</ScrollView>
			<Keyboard
				onKeyPressed={onKeyPressed}
				greenCaps={greenCaps}
				yellowCaps={yellowCaps}
				greyCaps={greyCaps}
			/>
			<HoveringText visible={invalidWord} message="Not in word list!" />
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
	},
	titleSecondary: {
		color: colors.secondary,
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
	},
});
