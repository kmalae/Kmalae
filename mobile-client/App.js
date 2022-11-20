import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { store } from "./src/store";
import { Platform } from "react-native";
import { StripeProvider } from "@stripe/stripe-react-native";
import config from "./config";

// importing screens
import LoadingScreen from "./src/screens/LoadingScreen";

import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import VehicleRegistration from "./src/screens/VehicleRegistration";
import TopupScreen from "./src/screens/TopupScreen";

import HomeScreen from "./src/screens/HomeScreen";
import GiveRide from "./src/screens/GiveRide";
import RideRequestScreen from "./src/screens/RideRequestScreen";
import FlashMessage from "react-native-flash-message";
import ShowAllUserVehicles from "./src/screens/ShowAllUserVehicle";
import ShowAllLiftRequests from "./src/screens/ShowAllLiftRequests";
import ShowAllRideRequests from "./src/screens/ShowAllRideRequests";
import ShowAllPotentialPassengers from "./src/screens/ShowAllPotentialPassengers";

import PaymentHistory from "./src/screens/PaymentHistory";
import PaymentScreen from "./src/screens/PaymentScreen";
import ReviewScreen from "./src/screens/ReviewScreen";
import RideHistory from "./src/screens/RideHistory";

const navTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: "transparent",
	},
};

export default function App() {
	const Stack = createNativeStackNavigator();

	return (
		<StripeProvider
			publishableKey={config.STRIPE_PUBLISHABLE_KEY}
			urlScheme={config.KMALAE_DOMAIN}
			merchantIdentifier="merchant.com.{{Kmalae}}">
			<Provider store={store}>
				<NavigationContainer theme={navTheme}>
					{/* <KeyboardAvoidingView
						style={{ flex: 1 }}
						behavior={Platform.OS === "ios" ? "padding" : "height"}
						keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
					> */}
					<Stack.Navigator>
						<Stack.Screen
							name="LoadingScreen"
							component={LoadingScreen}
							options={{
								headerShown: false,
							}}
						/>
						<Stack.Screen
							name="LoginScreen"
							component={LoginScreen}
							options={{
								headerShown: false,
							}}
						/>
						<Stack.Screen
							name="SignupScreen"
							component={SignupScreen}
							options={{
								headerShown: false,
							}}
						/>
						<Stack.Screen
							name="VehicleRegistration"
							component={VehicleRegistration}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="HomeScreen"
							component={HomeScreen}
							options={{
								headerShown: false,
							}}
						/>
						<Stack.Screen
							name="TopupScreen"
							component={TopupScreen}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="ShowAllLiftRequests"
							component={ShowAllLiftRequests}
							options={{
								headerShown: false,
							}}
						/>
						<Stack.Screen
							name="ShowAllUserVehicles"
							component={ShowAllUserVehicles}
							options={{
								headerShown: false,
							}}
						/>

						<Stack.Screen
							name="ShowAllPotentialPassengers"
							component={ShowAllPotentialPassengers}
							options={{
								headerShown: false,
							}}
						/>

						<Stack.Screen
							name="RideRequestScreen"
							component={RideRequestScreen}
							options={{
								headerShown: false,
							}}
						/>

						<Stack.Screen
							name="GiveRide"
							component={GiveRide}
							options={{
								headerShown: false,
							}}
						/>

						<Stack.Screen
							name="ShowAllRideRequests"
							component={ShowAllRideRequests}
							options={{
								headerShown: false,
							}}
						/>
						<Stack.Screen
							name="RideHistory"
							component={RideHistory}
							options={{
								headerShown: false,
							}}
						/>
						<Stack.Screen
							name="ReviewScreen"
							component={ReviewScreen}
							options={{
								headerShown: false,
							}}
						/>
						<Stack.Screen
							name="PaymentHistory"
							component={PaymentHistory}
							options={{
								headerShown: false,
							}}
						/>
						<Stack.Screen
							name="PaymentScreen"
							component={PaymentScreen}
							options={{
								headerShown: false,
							}}
						/>
					</Stack.Navigator>
					{/* </KeyboardAvoidingView> */}
					<FlashMessage position="top" />
				</NavigationContainer>
			</Provider>
		</StripeProvider>
	);
}
