import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import LoginScreen from "./src/screens/LoginScreen";

export default function App() {
	const Stack = createNativeStackNavigator();
	return (
		<NavigationContainer>
			<SafeAreaProvider>
				<Stack.Navigator>
					<Stack.Screen
						name="LoginScreen"
						component={LoginScreen}
						options={{
							headerShown: false,
						}}
					/>
				</Stack.Navigator>
			</SafeAreaProvider>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
