import { useRef, useState, useEffect } from "react";
import {
	View,
	SafeAreaView,
	StyleSheet,
	ImageBackground,
	Text,
	Dimensions,
	KeyboardAvoidingView,
} from "react-native";
import styled from "styled-components";
import { Icon } from "react-native-elements";
import config from "../../config";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

import { selectWidth, selectHeight } from "../slices/CommonSlice";
import { useSelector } from "react-redux";

var deviceWidth;
var deviceHeight;

const LoginScreen = () => {
	const [userEmail, setUserEmail] = useState("");
	const [userPassword, setUserPassword] = useState("");
	const navigator = useNavigation();

	const deviceWidth = useSelector(selectWidth);
	const deviceHeight = useSelector(selectHeight);

	useEffect(() => {
		axios
			.get(`${config.KMALAE_DOMAIN}/api/users/currentuser`)
			.then((response) => {
				// if (response.data.currentUser !== null) {
				// 	navigator.replace("PaymentHistory");
				// }
			})
			.catch((error) => console.log(error.response.data.errors));
	}, []);

	// Functions
	const signinUser = () => {
		axios
			.post(`${config.KMALAE_DOMAIN}/api/users/signin`, {
				email: userEmail,
				password: userPassword,
			})
			.then((response) => navigator.replace("HomeScreen"))
			.catch((error) => console.log(error.response.data.errors));
	};

	return (
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

						<StyledButton onPress={signinUser}>
							<Text style={{ fontSize: 22, color: "white" }}>
								Signin
							</Text>
						</StyledButton>

						<NavigateToSignupButton>
							<Text
								style={{
									color: "white",
									fontSize: 18,
									marginRight: 10,
								}}>
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
		</KeyboardAvoidingView>
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
		opacity: 0.7,
	},
	container: {
		flex: 1,
		zIndex: 3,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
});

const FormContainer = styled.View`
	height: 45%;
	width: 90%;
	z-index: 4;
	margin-top: 10%;
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
		<InputContainer>
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
	height: 55px;
	width: 310px;
	border-width: 2px;
	border-radius: 10px;
	border-color: lightgreen;
	margin-top: 3px;
	margin-bottom: 15px;
	box-shadow: 3px 3px 3px green;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	position: relative;
`;

const LeftIcon = styled.View`
	height: 80%;
	width: 20%;
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
	width: 65%;
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
