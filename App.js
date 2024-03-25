import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
	StyleSheet,
	Text,
	SafeAreaView,
	View,
	ScrollView,
	Alert,
} from "react-native";

import { colors, CLEAR, ENTER, colorsToEmoji, words } from "./src/constants";
import Keyboard from "./src/components/Keyboard";
import * as Clipboard from "expo-clipboard";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const NUM_TRIES = 6;

const copyArray = (arr) => {
	return [...arr.map((rows) => [...rows])];
};

function getRandomWord() {
	return Math.floor(Math.random() * words.length);
}

export default function App() {
	const [word, setWord] = useState(words[getRandomWord()]);
	const [letters, setLetters] = useState(word.split(""));

	const [rows, setRows] = useState(
		new Array(NUM_TRIES).fill(new Array(letters.length).fill(""))
	);
	const [curRow, setCurRow] = useState(0);
	const [curCol, setCurCol] = useState(0);
	const [gameState, setGameState] = useState("playing"); //Won, lost, playing

	useEffect(() => {
		// Check game state only if the game has started
		if (curRow > 0 && gameState === "playing") {
			checkGameState();
		}
	}, [curRow, gameState]);

	const checkGameState = () => {
		if (checkIfWon() && gameState !== "won") {
			Alert.alert("Yeehaw!", "You won! Share your score?", [
				{ text: "Share", onPress: shareScore },
				{ text: "No Thanks", onPress: playAgain },
			]);
			setGameState("won");
		} else if (checkIfLost() && gameState !== "lost") {
			Alert.alert("Bummer!", `The word was ${word.toUpperCase()}`, [
				{ text: "Try Again", onPress: playAgain },
			]);
			setGameState("lost");
		}
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
		Alert.alert("Copied to clipboard!", "Share your score on social media!");
	};

	const playAgain = () => {
		// Update rows, curRow, and curCol
		setRows(new Array(NUM_TRIES).fill(new Array(letters.length).fill("")));
		setCurRow(0);
		setCurCol(0);
		setGameState("playing");

		// Generate a new random word
		getWord();
	};

	const getWord = () => {
		const newRandomWordIndex = getRandomWord();
		setWord(words[newRandomWordIndex]);
		setLetters(words[newRandomWordIndex].split(""));
		console.log("Word: ", word);
	};

	const onKeyPressed = (key) => {
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
			console.log(word);
			if (curCol === rows[0].length) {
				setCurRow(curRow + 1);
				setCurCol(0);
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

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style="light" />

			<Text>
				<Text style={styles.title}>Word </Text>
				<Text style={[styles.title, styles.titleSecondary]}>Whirl</Text>
			</Text>

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
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.black,
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
