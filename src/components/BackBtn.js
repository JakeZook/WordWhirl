import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../constants";

const BackButton = () => {
	const navigation = useNavigation();

	const handleGoBack = () => {
		navigation.goBack();
	};

	return (
		<TouchableOpacity onPress={handleGoBack} style={styles.container}>
			<Ionicons name="chevron-back" size={24} color={colors.lightgrey} />
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 10,
		marginRight: 50,
	},
});

export default BackButton;
