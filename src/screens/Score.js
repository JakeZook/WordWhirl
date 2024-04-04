import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors } from "../constants";

const Score = ({ navigation }) => {
	return (
		<View>
			<Text>Scores</Text>
			<Text>Coming soon!</Text>
			<TouchableOpacity onPress={() => navigation.navigate("MainMenu")}>
				<Text>Back</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Score;
