import { useRef, useState, useEffect } from "react";
import {
	View,
	SafeAreaView,
	StyleSheet,
	ImageBackground,
	Text,
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
} from "../slices/FirstFormSlice";

import {
	selectEmail,
	selectPassword,
	selectConfirmPassword,
} from "../slices/SecondFormSlice";

import { selectUserImage } from "../slices/ThirdFormSlice";

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

const transitionConfig = {
	animation: "spring",
	config: {
		stiffness: 1000,
		damping: 500,
		mass: 3,
		overshootClamping: true,
		restDisplacementThreshold: 0.1,
		restSpeedThreshold: 0.1,
	},
};

const SignupScreen = () => {
	const [delay, setDelay] = useState(true);
	const Stack = createNativeStackNavigator();
	const navigator = useNavigation();
	const dispatch = useDispatch();

	const [formLoaded, setFormLoaded] = useState("first");

	// User credentials
	const email = useSelector(selectEmail);
	const password = useSelector(selectPassword);
	const confirmPassword = useSelector(selectConfirmPassword);
	const firstName = useSelector(selectFirstName);
	const lastName = useSelector(selectLastName);
	const DOB = useSelector(selectDOB);
	const IDNumber = useSelector(selectIDNumber);
	const phoneNumber = useSelector(selectPhoneNumber);
	const userImage = useSelector(selectUserImage);

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
		const userData = new FormData();
		userData.append("email", email.trim());
		userData.append("password", password.trim());
		userData.append("firstName", firstName.trim());
		userData.append("lastName", lastName.trim());
		userData.append("IDNumber", IDNumber);
		userData.append("dateOfBirth", DOB);
		userData.append("phoneNumber", phoneNumber);
		userData.append("userImage", userImage);
		console.log({ userImage });

		axios
			.post(`${config.KMALAE_DOMAIN}/api/users/signup`, userData)
			.then((response) => {
				console.log(response.headers);
				console.log("###################################");
				console.log(response.data);
			})
			.catch((error) => console.log(error.response.data.errors));
	};

	return (
		<View style={styles.outerContainer}>
			<ImageBackground
				source={require("../../assets/images/kmalae-bg.png")}
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

					<Stack.Navigator style={{ overflowY: "scroll" }}>
						<Stack.Screen
							name="FirstSignupForm"
							options={{
								headerShown: false,
							}}>
							{(props) => (
								<FirstSignupForm
									{...props}
									delay={delay}
									setDelay={setDelay}
								/>
							)}
						</Stack.Screen>
						<Stack.Screen
							name="SecondSignupForm"
							options={{
								headerShown: false,
							}}>
							{(props) => (
								<SecondSignupForm
									{...props}
									delay={delay}
									setDelay={setDelay}
								/>
							)}
						</Stack.Screen>
						<Stack.Screen
							name="ThirdSignupForm"
							options={{
								headerShown: false,
							}}>
							{(props) => (
								<ThirdSignupForm
									{...props}
									delay={delay}
									setDelay={setDelay}
								/>
							)}
						</Stack.Screen>
					</Stack.Navigator>

					<SignupButtonComponent
						formLoaded={formLoaded}
						setFormLoaded={setFormLoaded}
						setDelay={setDelay}
						navigator={navigator}
						firstFormFilled={firstFormFilled}
						secondFormFilled={secondFormFilled}
						registerUser={registerUser}
					/>

					<NavigateToSigninButton>
						<Text
							style={{ color: "white", fontSize: 18, marginRight: 10 }}>
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
		opacity: 0.9,
	},
	container: {
		flex: 1,
		zIndex: 3,
		display: "flex",
		justifyContent: "flex-end",
		alignItems: "center",
	},
});

const FormContainer = styled.View`
	height: 75%;
	width: 90%;
	z-index: 4;
	margin-bottom: 35%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	padding: 5% 8%;
	border-radius: 10px;
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
							props.setDelay(true);
						} else {
							props.setFormLoaded("second");
							props.navigator.navigate("SecondSignupForm");
							props.setDelay(true);
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
							props.setDelay(true);
							props.navigator.navigate("SecondSignupForm");
						}
					} else if (props.formLoaded === "second") {
						if (props.secondFormFilled) {
							props.setFormLoaded("third");
							props.setDelay(true);
							props.navigator.navigate("ThirdSignupForm");
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
								: 0.7
							: props.secondFormFilled
							? 1
							: 0.7,
				}}>
				<Text style={{ fontSize: 25, color: "white" }}>
					{props.formLoaded !== "third" ? "Next" : "Register"}
				</Text>
			</AdvanceButton>
		</SignupButtonContainer>
	);
};

const SignupButtonContainer = styled.View`
	width: 100%;
	height: 50px;
	margin-top: 10px;
	padding: 0%;
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
	flex-direction: row;
	align-items: center;
	justify-content: center;
`;
