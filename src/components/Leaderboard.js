import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../constants";

//Leaderboard button for navigation
const LeaderboardButton = ({ onPress }) => {
	return (
		<TouchableOpacity onPress={onPress} style={styles.container}>
			<MaterialIcons name="leaderboard" size={24} color={colors.lightgrey} />
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 10,
		marginLeft: 50,
	},
});

export default LeaderboardButton;
