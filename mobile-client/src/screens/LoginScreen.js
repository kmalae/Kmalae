import { useRef, useState, useEffect } from "react";
import {
	View,
	SafeAreaView,
	StyleSheet,
	ImageBackground,
	TextInput,
	Text,
	TouchableOpacity,
	Button,
	Pressable,
} from "react-native";
import styled, { withTheme } from "styled-components";
import { Icon } from "react-native-elements";
import config from "../../config";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

import HomeScreen from "../screens/HomeScreen";

const LoginScreen = () => {
	const [userEmail, setUserEmail] = useState("");
	const [userPassword, setUserPassword] = useState("");
	const navigator = useNavigation();

	useEffect(() => {
		console.log(config.KMALAE_DOMAIN);
		axios
			.get(`${config.KMALAE_DOMAIN}/api/users/currentuser`)
			.then((response) => {
				console.log(response.data);
				const data = response.data;
				if (data.currentUser === null) {
					return;
				} else {
					navigator.navigate("LoginScreen");
				}
			});
	}, []);

	// Functions
	const signinUser = () => {
		axios
			.post(`${config.KMALAE_DOMAIN}/api/users/signin`, {
				email: userEmail,
				password: userPassword,
			})
			.then((response) => navigator.navigate("PaymentScreen"))
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
					<StyledTextInput
						icon="email"
						placeholder="Email"
						placeholderTextColor="gray"
						returnKeyType="done"
						isPassword={false}
						userEmail={userEmail}
						setUserEmail={setUserEmail}
					/>

					<StyledTextInput
						icon="lock"
						placeholder="Password"
						placeholderTextColor="gray"
						returnKeyType="done"
						isPassword={true}
						userPassword={userPassword}
						setUserPassword={setUserPassword}
					/>

					<StyledButton
						onPress={() => {
							signinUser();
						}}>
						<Text style={{ fontSize: 22, color: "white" }}>Signin</Text>
					</StyledButton>

					<NavigateToSignupButton>
						<Text
							style={{ color: "white", fontSize: 18, marginRight: 10 }}>
							Not registered yet?
						</Text>
						<Text
							style={{
								color: "aqua",
								fontSize: 18,
							}}
							onPress={() => {
								navigator.navigate("SignupScreen");
							}}>
							Signup
						</Text>
					</NavigateToSignupButton>
				</FormContainer>
			</SafeAreaView>
		</View>
	);
};

export default LoginScreen;

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
	height: 45%;
	width: 90%;
	z-index: 4;
	margin-bottom: 35%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	padding: 0% 8%;
	border-radius: 10px;
	padding-top: 5%;
	padding-bottom: 5%;
`;

const StyledTextInput = ({
	icon,
	placeholder,
	placeholderTextColor,
	label,
	isPassword,
	...props
}) => {
	const [hidePassword, setHidePassword] = useState(true);

	return (
		<InputContainer style={isPassword && { paddingRight: 50 }}>
			<LeftIcon>
				<Icon name={icon} type="fontawesome" color="green" size={30} />
			</LeftIcon>

			<InputField
				placeholder={placeholder}
				placeholderTextColor={placeholderTextColor}
				value={!isPassword ? props.userEmail : props.userPassword}
				onChangeText={(value) =>
					!isPassword
						? props.setUserEmail(value)
						: props.setUserPassword(value)
				}
				secureTextEntry={isPassword && hidePassword ? true : false}
			/>

			{isPassword && (
				<RightIcon onPress={() => setHidePassword(!hidePassword)}>
					<Icon
						name={hidePassword ? "visibility-off" : "visibility"}
						type="material"
						size={25}
					/>
				</RightIcon>
			)}
		</InputContainer>
	);
};

const InputContainer = styled.View`
	background-color: white;
	height: 60px;
	width: 100%;
	border-width: 2px;
	border-radius: 10px;
	border-color: lightgreen;
	margin-top: 3px;
	margin-bottom: 15px;
	padding-left: 51px;
	box-shadow: 3px 3px 3px green;
`;

const LeftIcon = styled.View`
	position: absolute;
	top: 8%;
	left: 0;
	z-index: 9;
	height: 80%;
	width: 50px;
	border-right-width: 2px;
	border-color: lightgray;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const RightIcon = styled.TouchableOpacity`
	position: absolute;
	top: 8%;
	right: 0;
	z-index: 9;
	height: 90%;
	width: 50px;
	border-color: gray;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const InputField = styled.TextInput`
	background-color: white;
	height: 100%;
	width: 100%;
	border: none;
	border-radius: 10px;
	padding: 15px;
	padding-left: 8px;
	font-size: 20px;
`;

const StyledButton = styled.TouchableOpacity`
	height: 45px;
	width: 100px;
	background-color: green;
	color: white;
	border-radius: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 10px;
`;

const NavigateToSignupButton = styled.View`
	height: 40px;
	width: 100%;
	margin-top: 15px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
`;
