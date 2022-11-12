import axios from "axios";
import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "react-native-elements";
import styled from "styled-components";
import config from "../../../config";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Appearance } from "react-native";

import {
	selectFirstName,
	setFirstName,
	selectLastName,
	setLastName,
	selectDOB,
	setDOB,
	selectIDNumber,
	setIDNumber,
	selectPhoneNumber,
	setPhoneNumber,
} from "../../slices/FirstFormSlice";

import {
	selectFirstNameError,
	setFirstNameError,
	selectLastNameError,
	setLastNameError,
	selectDOBError,
	setDOBError,
	selectIDNumberError,
	setIDNumberError,
	selectPhoneNumberError,
	setPhoneNumberError,
} from "../../slices/SignupErrorMessagesSlice";

const FirstSignupForm = ({ delay, setDelay }) => {
	const firstName = useSelector(selectFirstName);
	const lastName = useSelector(selectLastName);
	const DOB = useSelector(selectDOB);
	const IDNumber = useSelector(selectIDNumber);
	const phoneNumber = useSelector(selectPhoneNumber);

	const firstNameError = useSelector(selectFirstNameError);
	const lastNameError = useSelector(selectLastNameError);
	const DOBError = useSelector(selectDOBError);
	const IDNumberError = useSelector(selectIDNumberError);
	const phoneNumberError = useSelector(selectPhoneNumberError);

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
				placeholder="First name"
				state={firstName}
				setState={setFirstName}
				errorMessage={firstNameError}
				setErrorMessage={setFirstNameError}
				isTextInput={true}
				axiosLabel={"firstName"}
			/>

			<StyledTextInput
				placeholder="Last name"
				state={lastName}
				setState={setLastName}
				errorMessage={lastNameError}
				setErrorMessage={setLastNameError}
				isTextInput={true}
				axiosLabel={"lastName"}
			/>

			<StyledTextInput
				placeholder="Date of Birth"
				state={DOB}
				setState={setDOB}
				errorMessage={DOBError}
				setErrorMessage={setDOBError}
				isTextInput={false}
				axiosLabel={"dateOfBirth"}
			/>

			<StyledTextInput
				placeholder="Emirates ID"
				state={IDNumber}
				setState={setIDNumber}
				errorMessage={IDNumberError}
				setErrorMessage={setIDNumberError}
				isTextInput={true}
				axiosLabel={"IDNumber"}
			/>

			<StyledTextInput
				placeholder="Phone nubmer"
				state={phoneNumber}
				setState={setPhoneNumber}
				errorMessage={phoneNumberError}
				setErrorMessage={setPhoneNumberError}
				isTextInput={true}
				axiosLabel={"phoneNumber"}
			/>
		</View>
	) : (
		<></>
	);
};

export default FirstSignupForm;

const StyledTextInput = ({
	placeholder,
	state,
	setState,
	errorMessage,
	setErrorMessage,
	axiosLabel,
}) => {
	const dispatch = useDispatch();
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

	const validateInput = () => {
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
	};

	function pad(n) {
		return n < 10 ? "0" + n : n;
	}

	return (
		<InputContainer>
			<InputField
				placeholder={placeholder}
				placeholderTextColor="gray"
				value={state}
				editable={axiosLabel !== "dateOfBirth"}
				onChangeText={(value) => {
					dispatch(setState(value));
				}}
				onBlur={() => validateInput()}
			/>

			{axiosLabel === "dateOfBirth" && (
				<>
					<RightIcon onPress={() => setDatePickerVisibility(true)}>
						<Icon name="calendar" type="antdesign" size={26} color="green" />
					</RightIcon>
					<DateTimePickerModal
						isVisible={isDatePickerVisible}
						mode="date"
						isDarkModeEnabled={false}
						date={state === "" ? new Date("1998-06-01") : new Date(state)}
						onHide={() => validateInput()}
						onConfirm={(date) => {
							dispatch(
								setState(
									`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
										date.getDate()
									)}`
								)
							);

							validateInput();

							setDatePickerVisibility(false);
						}}
						onCancel={() => setDatePickerVisibility(false)}
					/>
				</>
			)}
			<InvalidMessage>
				<Text style={{ margin: 0, color: "red" }}>{errorMessage}</Text>
			</InvalidMessage>
		</InputContainer>
	);
};

const InputContainer = styled.View`
	display: flex;
	flex-direction: column;
	background-color: white;
	height: 58px;
	width: 97%;
	border-width: 2px;
	border-radius: 10px;
	border-color: lightgreen;
	margin: 3px 4px 20px 4px;
	padding-left: 10px;
	padding-bottom: 1px;
	box-shadow: 3px 3px 3px green;
`;

const InputField = styled.TextInput`
	background-color: white;
	height: 75%;
	width: 80%;
	border: none;
	border-radius: 10px;
	padding: 10px 0px 0px 5px;
	font-size: 20px;
	margin-bottom: 1px;
	align-self: flex-start;
`;

const InvalidMessage = styled.View`
	align-self: flex-end;
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: flex-end;
	height: 15px;
	padding-right: 10px;
`;

const RightIcon = styled.TouchableOpacity`
	position: absolute;
	top: 0%;
	right: 0;
	z-index: 9;
	height: 90%;
	width: 50px;
	border-color: gray;
	display: flex;
	justify-content: center;
	align-items: center;
`;
