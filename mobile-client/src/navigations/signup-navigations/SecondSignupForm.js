import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styled from "styled-components";
import { Icon } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import config from "../../../config";

import {
	selectEmail,
	setEmail,
	selectPassword,
	setPassword,
	selectConfirmPassword,
	setConfirmPassword,
} from "../../slices/SecondFormSlice";

import {
	selectEmailError,
	setEmailError,
	selectPasswordError,
	setPasswordError,
	selectConfirmPasswordError,
	setConfirmPasswordError,
} from "../../slices/SignupErrorMessagesSlice.js";

const FirstSignupForm = ({ delay, setDelay }) => {
	const email = useSelector(selectEmail);
	const password = useSelector(selectPassword);
	const confirmPassword = useSelector(selectConfirmPassword);

	const emailError = useSelector(selectEmailError);
	const passwordError = useSelector(selectPasswordError);
	const confirmPasswordError = useSelector(selectConfirmPasswordError);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDelay((current) => false);
		}, 500);
		return () => clearTimeout(timer);
	}, [delay]);

	return !delay ? (
		<View
			style={{
				height: "100%",
				justifyContent: "center",
			}}
		>
			<StyledTextInput
				icon="email"
				placeholder="Email"
				isPassword={false}
				state={email}
				setState={setEmail}
				errorMessage={emailError}
				setErrorMessage={setEmailError}
				axiosLabel={"email"}
			/>

			<StyledTextInput
				icon="lock"
				placeholder="Password"
				isPassword={true}
				state={password}
				setState={setPassword}
				errorMessage={passwordError}
				setErrorMessage={setPasswordError}
				axiosLabel={"password"}
			/>

			<StyledTextInput
				icon="lock"
				placeholder="Confirm password"
				isPassword={true}
				state={confirmPassword}
				setState={setConfirmPassword}
				errorMessage={confirmPasswordError}
				setErrorMessage={setConfirmPasswordError}
				axiosLabel={"confirmPassword"}
			/>
		</View>
	) : (
		<></>
	);
};

export default FirstSignupForm;

const StyledTextInput = ({
	icon,
	placeholder,
	axiosLabel,
	isPassword,
	state,
	setState,
	errorMessage,
	setErrorMessage,
}) => {
	const dispatch = useDispatch();
	const password = useSelector(selectPassword);
	const confirmPasswordError = useSelector(selectConfirmPasswordError);

	const validateInput = () => {
		if (axiosLabel !== "confirmPassword") {
			axios
				.post(`${config.KMALAE_DOMAIN}/api/users/validateInput`, {
					[`${axiosLabel}`]: state,
				})
				.then(() => dispatch(setErrorMessage("")))
				.catch((error) => {
					if (error !== undefined) {
						dispatch(setErrorMessage(error.response.data.errors[0].message));
					}
				});
		} else {
			console.log({ password, state, confirmPasswordError });
			if (password !== state) {
				dispatch(setErrorMessage("Password does not match"));
			} else dispatch(setErrorMessage(""));
		}
	};

	return (
		<InputContainer style={isPassword && { paddingRight: 50 }}>
			<LeftIcon>
				<Icon name={icon} type="fontawesome" color="green" size={30} />
			</LeftIcon>
			<InputField
				placeholder={placeholder}
				placeholderTextColor="gray"
				value={state}
				onChangeText={(value) => {
					dispatch(setState(value));
				}}
				onEndEditing={() => validateInput()}
				secureTextEntry={isPassword ? true : false}
			/>
			<RightIcon style={{ display: errorMessage === "" ? "block" : "none" }}>
				<Icon name="check-circle" type="feather" size={23} color="green" />
			</RightIcon>
			<ErrorMessage style={{ display: errorMessage !== "" ? "block" : "none" }}>
				<Text style={{ margin: 0, color: "red" }}>{errorMessage}</Text>
			</ErrorMessage>
		</InputContainer>
	);
};

const InputContainer = styled.View`
	background-color: white;
	height: 58px;
	width: 97%;
	border-width: 2px;
	border-radius: 10px;
	border-color: lightgreen;
	margin: 3px 4px 20px 4px;
	padding-left: 50px;
	padding-right: 35px;
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

const ErrorMessage = styled.View`
	z-index: 3;
	position: absolute;
	bottom: 0;
	right: 0;
	width: 250px;
	display: flex;
	justify-content: flex-start;
	align-items: flex-end;
	height: 15px;
	padding-right: 10px;
`;
