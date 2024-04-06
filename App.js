import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainMenu from "./src/screens/mainMenu";
import GameScreen from "./src/screens/gameScreen";
import HowToPlay from "./src/screens/HowToPlay";
import Score from "./src/screens/Score";

const Stack = createNativeStackNavigator();

function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="MainMenu">
				<Stack.Screen
					name="MainMenu"
					component={MainMenu}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="GameScreen"
					component={GameScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="HowToPlay"
					component={HowToPlay}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="Score"
					component={Score}
					options={{ headerShown: false }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;
