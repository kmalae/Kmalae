import { useRef, useState, useEffect } from "react";
import {
	View,
	SafeAreaView,
	StyleSheet,
	ImageBackground,
	Text,
	KeyboardAvoidingView,
} from "react-native";
import styled from "styled-components";
import config from "../../config";
import axios from "axios";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FirstSignupForm from "../navigations/signup-navigations/FirstSignupForm";
import SecondSignupForm from "../navigations/signup-navigations/SecondSignupForm";
import ThirdSignupForm from "../navigations/signup-navigations/ThirdSignupForm";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";

import {
	selectFirstName,
	selectLastName,
	selectDOB,
	selectIDNumber,
	selectPhoneNumber,
	selectEmail,
	selectPassword,
	selectAvatarID,
} from "../slices/SignupSlice";

import {
	selectFirstNameError,
	selectLastNameError,
	selectDOBError,
	selectIDNumberError,
	selectPhoneNumberError,
	selectEmailError,
	selectPasswordError,
	selectConfirmPasswordError,
	selectFirstFormFilled,
	setFirstFormFilled,
	selectSecondFormFilled,
	setSecondFormFilled,
} from "../slices/SignupErrorMessagesSlice";

import {
	selectTransitionDelay,
	setTransitionDelay,
} from "../slices/CommonSlice";

const SignupScreen = () => {
	const dispatch = useDispatch();

	const transitionDelay = useSelector(selectTransitionDelay);

	const Stack = createNativeStackNavigator();
	const navigator = useNavigation();

	const [formLoaded, setFormLoaded] = useState("first");

	// User credentials
	const email = useSelector(selectEmail);
	const password = useSelector(selectPassword);
	const firstName = useSelector(selectFirstName);
	const lastName = useSelector(selectLastName);
	const DOB = useSelector(selectDOB);
	const IDNumber = useSelector(selectIDNumber);
	const phoneNumber = useSelector(selectPhoneNumber);
	const avatarID = useSelector(selectAvatarID);

	const firstNameError = useSelector(selectFirstNameError);
	const lastNameError = useSelector(selectLastNameError);
	const DOBError = useSelector(selectDOBError);
	const IDNumberError = useSelector(selectIDNumberError);
	const phoneNumberError = useSelector(selectPhoneNumberError);

	const emailError = useSelector(selectEmailError);
	const passwordError = useSelector(selectPasswordError);
	const confirmPasswordError = useSelector(selectConfirmPasswordError);

	const firstFormFilled = useSelector(selectFirstFormFilled);
	const secondFormFilled = useSelector(selectSecondFormFilled);

	useEffect(() => {
		const timer = setTimeout(() => {
			dispatch(setTransitionDelay(false));
		}, 500);
		return () => clearTimeout(timer);
	}, [transitionDelay]);

	useEffect(() => {
		if (
			firstNameError !== "" ||
			lastNameError !== "" ||
			DOBError !== "" ||
			IDNumberError !== "" ||
			phoneNumberError !== ""
		) {
			dispatch(setFirstFormFilled(false));
			return;
		}

		dispatch(setFirstFormFilled(true));
	}, [
		firstNameError,
		lastNameError,
		DOBError,
		IDNumberError,
		phoneNumberError,
	]);

	useEffect(() => {
		if (
			(emailError !== "", passwordError !== "", confirmPasswordError !== "")
		) {
			dispatch(setSecondFormFilled(false));
			return;
		}

		dispatch(setSecondFormFilled(true));
	}, [emailError, passwordError, confirmPasswordError]);

	const registerUser = () => {
		axios
			.post(`${config.KMALAE_DOMAIN}/api/users/signup`, {
				email: email.trim().toLowerCase(),
				password: password,
				firstName: firstName.trim().toLowerCase(),
				lastName: lastName.trim().toLowerCase(),
				IDNumber,
				dateOfBirth: DOB,
				phoneNumber,
				avatarID,
			})
			.then((response) => {
				dispatch(setTransitionDelay(true));
				navigator.replace("VehicleRegistration");
			})
			.catch((error) => console.log(error.response.data.errors));
	};

	return !transitionDelay ? (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}>
			<View style={styles.outerContainer}>
				<ImageBackground
					source={require("../../assets/images/kmalae-bg-2.jpg")}
					style={styles.backgroundImage}></ImageBackground>
				<View style={styles.fader}></View>
				<SafeAreaView style={styles.container}>
					<FormContainer>
						<ProgressBarContainer>
							<ProgressEndPoints style={{ backgroundColor: "green" }} />
							<ProgressRoute
								style={{
									backgroundColor: `${
										formLoaded === "first" ? "lightgray" : "green"
									}`,
								}}
							/>
							<ProgressEndPoints
								style={{
									backgroundColor: `${
										formLoaded in { second: "second", third: "third" }
											? "green"
											: "lightgray"
									}`,
								}}
							/>
							<ProgressRoute
								style={{
									backgroundColor: `${
										formLoaded === "third" ? "green" : "lightgray"
									}`,
								}}
							/>
							<ProgressEndPoints
								style={{
									backgroundColor: `${
										formLoaded === "third" ? "green" : "lightgray"
									}`,
								}}
							/>
						</ProgressBarContainer>

						<Stack.Navigator>
							<Stack.Screen
								name="FirstSignupForm"
								options={{
									headerShown: false,
								}}>
								{(props) => <FirstSignupForm {...props} />}
							</Stack.Screen>

							<Stack.Screen
								name="SecondSignupForm"
								options={{
									headerShown: false,
								}}>
								{(props) => <SecondSignupForm {...props} />}
							</Stack.Screen>

							<Stack.Screen
								name="ThirdSignupForm"
								options={{
									headerShown: false,
								}}>
								{(props) => <ThirdSignupForm {...props} />}
							</Stack.Screen>
						</Stack.Navigator>
						<SignupButtonComponent
							formLoaded={formLoaded}
							setFormLoaded={setFormLoaded}
							navigator={navigator}
							firstFormFilled={firstFormFilled}
							secondFormFilled={secondFormFilled}
							registerUser={registerUser}
						/>

						<NavigateToSigninButton>
							<Text
								style={{
									color: "white",
									fontSize: 18,
									marginRight: 10,
								}}>
								Already have an account?
							</Text>
							<Text
								style={{
									color: "aqua",
									fontSize: 18,
								}}
								onPress={() => {
									navigator.navigate("LoginScreen");
								}}>
								Signin
							</Text>
						</NavigateToSigninButton>
					</FormContainer>
				</SafeAreaView>
			</View>
		</KeyboardAvoidingView>
	) : (
		<></>
	);
};

export default SignupScreen;

const styles = StyleSheet.create({
	outerContainer: {
		width: "100%",
		height: "100%",
		position: "relative",
	},
	backgroundImage: {
		height: "100%",
		width: "100%",
		position: "absolute",
		top: 0,
		left: 0,
		zIndex: 0,
	},
	fader: {
		height: "100%",
		width: "100%",
		position: "absolute",
		top: 0,
		left: 0,
		zIndex: 1,
		backgroundColor: "black",
		opacity: 0.7,
	},
	container: {
		flex: 1,
		zIndex: 3,
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "center",
	},
});

const FormContainer = styled.View`
	height: 75%;
	width: 400px;
	margin-top: 10%;
	z-index: 4;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
`;

const ProgressBarContainer = styled.View`
	margin-bottom: 30px;
	height: 30px;
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;

const ProgressEndPoints = styled.View`
	height: 25px;
	width: 25px;
	border-radius: 50%;
`;

const ProgressRoute = styled.View`
	height: 3px;
	width: 80px;
`;

const SignupButtonComponent = ({ registerUser, ...props }) => {
	const transitionDelay = useSelector(selectTransitionDelay);

	const canAdvance = () => {
		if (props.formLoaded === "first") return !props.firstFormFilled;
		else if (props.formLoaded === "second") return !props.secondFormFilled;
		else return false;
	};
	return (
		<SignupButtonContainer>
			{props.formLoaded !== "first" && (
				<PreviousFormButton
					onPress={() => {
						if (props.formLoaded === "second") {
							props.setFormLoaded("first");
							props.navigator.navigate("FirstSignupForm");
							setTransitionDelay(true);
						} else {
							props.setFormLoaded("second");
							props.navigator.navigate("SecondSignupForm");
							setTransitionDelay(true);
						}
					}}>
					<Icon
						name="arrowleft"
						type="antdesign"
						size={23}
						color="white"
					/>
				</PreviousFormButton>
			)}
			<AdvanceButton
				onPress={() => {
					if (props.formLoaded === "first") {
						if (props.firstFormFilled) {
							props.setFormLoaded("second");
							props.navigator.navigate("SecondSignupForm");
							setTransitionDelay(true);
						}
					} else if (props.formLoaded === "second") {
						if (props.secondFormFilled) {
							props.setFormLoaded("third");
							props.navigator.navigate("ThirdSignupForm");
							setTransitionDelay(true);
						}
					} else {
						registerUser();
					}
				}}
				disabled={canAdvance()}
				style={{
					width: props.formLoaded === "first" ? "100%" : "83%",
					opacity:
						props.formLoaded === "first"
							? props.firstFormFilled
								? 1
								: 0.6
							: props.secondFormFilled
							? 1
							: 0.6,
				}}>
				<Text style={{ fontSize: 25, color: "white" }}>
					{props.formLoaded !== "third" ? "Next" : "Register"}
				</Text>
			</AdvanceButton>
		</SignupButtonContainer>
	);
};

const SignupButtonContainer = styled.View`
	height: 55px;
	width: 310px;
	margin-top: 10px;
	padding: 0%;
	align-self: center;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

const AdvanceButton = styled.TouchableOpacity`
	height: 100%;
	background-color: green;
	color: white;
	border-radius: 3px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const PreviousFormButton = styled.TouchableOpacity`
	height: 100%;
	width: 16%;
	background-color: green;
	border-radius: 3px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const NavigateToSigninButton = styled.View`
	height: 40px;
	width: 100%;
	margin-top: 15px;
	display: flex;
	align-self: center;
	flex-direction: row;
	align-items: center;
	justify-content: center;
`;
