import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, SafeAreaView, View, ScrollView } from "react-native";

import { colors } from "./src/constants";
import Keyboard from "./src/components/Keyboard";

const NUM_TRIES = 6;

export default function App() {
	const word = "hello";
	const letters = word.split("");

	const rows = Array.from({ length: NUM_TRIES }, (_, rowIndex) =>
		rowIndex === 0 ? letters : new Array(letters.length).fill("")
	);

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
						{row.map((cell, cellIndex) => (
							<View key={`cell-${rowIndex}-${cellIndex}`} style={styles.cell}>
								<Text style={styles.cellText}>{cell.toUpperCase()}</Text>
							</View>
						))}
					</View>
				))}
			</ScrollView>

			<Keyboard />
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
		marginVertical: 20,
	},
	row: {
		alignSelf: "stretch",
		flexDirection: "row",
	},
	cell: {
		margin: 3,
		flex: 1,
		aspectRatio: 1,

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
