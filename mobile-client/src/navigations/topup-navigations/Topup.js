import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	TouchableWithoutFeedback,
	Keyboard,
	ScrollView,
	Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useConfirmPayment, useStripe } from "@stripe/stripe-react-native";

// importing slices
import { selectCurrentUser } from "../../slices/CurrentUserSlice";
import { selectAmountToTopup, setAmountToTopup } from "../../slices/TopupSlice";
import config from "../../../config";
import axios from "axios";

const quickSelections = [
	{
		id: 1,
		amount: 5,
	},
	{
		id: 2,
		amount: 10,
	},
	{
		id: 3,
		amount: 20,
	},
	{
		id: 4,
		amount: 50,
	},
	{
		id: 5,
		amount: 75,
	},
	{
		id: 6,
		amount: 100,
	},
	{
		id: 7,
		amount: 150,
	},
	{
		id: 8,
		amount: 200,
	},
];

const Topup = ({ delay, setDelay }) => {
	const navigator = useNavigation();
	const dispatch = useDispatch();
	const { initPaymentSheet, presentPaymentSheet } = useStripe();
	const [loading, setLoading] = useState(false);
	const [paymentIntentState, setPaymentIntentState] = useState(null);
	const currentUser = useSelector(selectCurrentUser);
	const amountToTopup = useSelector(selectAmountToTopup);
	const [paymentIntentData, setPaymentIntentData] = useState(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDelay((current) => false);
		}, 500);
		return () => clearTimeout(timer);
	}, [delay]);

	const fetchPaymentSheetParams = async () => {
		const response = await fetch(
			`${config.KMALAE_DOMAIN}/api/topup/paymentSheet`,
			{
				method: "POST",
				body: JSON.stringify({ amountToTopup }),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		const { paymentIntent, ephemeralKey, customer } = await response.json();
		setPaymentIntentState(paymentIntent);
		return {
			paymentIntent,
			ephemeralKey,
			customer,
		};
	};
	useEffect(() => {
		if (amountToTopup !== null) initializePaymentSheet();
	}, [amountToTopup]);

	const initializePaymentSheet = async () => {
		const { paymentIntent, ephemeralKey, customer } =
			await fetchPaymentSheetParams();
		const { error } = await initPaymentSheet({
			customerId: customer,
			customerEphemeralKeySecret: ephemeralKey,
			paymentIntentClientSecret: paymentIntent,
		});
		if (!error) {
			setLoading(true);
		}
	};

	const openPaymentSheet = async () => {
		if (paymentIntentState !== null) {
			const { error } = await presentPaymentSheet();

			if (error) {
				console.log({ error_code: error.code });
				console.log({ error_message: error.message });
				Alert.alert("Error performing topup");
			} else {
				Alert.alert("Success", "Your topup is confirmed! 😎");
				dispatch(setAmountToTopup(null));
				navigator.navigate("Main");
				await axios
					.post(`${config.KMALAE_DOMAIN}/api/topup/performTopup`, {
						paymentIntent: paymentIntentState,
						amount: amountToTopup,
					})
					.then((result) => {
						setPaymentIntentData(result.data.payment_method_options);
						console.log(result.data);
					})
					.catch((error) => console.log(error.response.data.errors));
			}
		}
	};

	return !delay ? (
		<StackScreenContainer>
			<ReturnButtonContainer>
				<ReturnButton
					onPress={() => {
						setDelay((current) => true);
						dispatch(setAmountToTopup(null));
						navigator.navigate("Main");
					}}
				>
					<Icon
						name="chevron-left"
						type="fontawesome"
						size={33}
						color="white"
					/>
				</ReturnButton>
			</ReturnButtonContainer>

			<InputContainer>
				<CurrenctyContainer>AED</CurrenctyContainer>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
					<View style={{ flex: 1 }}>
						<InputField
							keyboardType="numeric"
							returnKeyType="done"
							value={amountToTopup}
							onChangeText={(value) => {
								dispatch(setAmountToTopup(value));
							}}
						/>
					</View>
				</TouchableWithoutFeedback>
				<RightIcon
					style={{ display: amountToTopup === "" ? "none" : "block" }}
					onPress={() => {
						dispatch(setAmountToTopup(null));
					}}
				>
					<Icon name="cancel" type="fontawesome" size={20} color="white" />
				</RightIcon>
			</InputContainer>

			<QuickSelectionsContainer horizontal={true}>
				{quickSelections.map(({ id, amount }) => {
					return (
						<QuickSelection
							key={id}
							onPress={() => {
								dispatch(setAmountToTopup(amount.toString()));
							}}
						>
							<TextContainer style={{ fontSize: 20 }}>
								AED {amount}
							</TextContainer>
						</QuickSelection>
					);
				})}
			</QuickSelectionsContainer>

			<RechargeButtonContianer
				style={{
					backgroundColor: amountToTopup !== null ? "#872121" : "lightgray",
				}}
				disabled={amountToTopup === null}
				onPress={openPaymentSheet}
			>
				<TextContainer
					style={{ color: amountToTopup !== null ? "white" : "gray" }}
				>
					Topup
				</TextContainer>
			</RechargeButtonContianer>
		</StackScreenContainer>
	) : (
		<></>
	);
};

export default Topup;

const StackScreenContainer = styled.View`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
`;

const ReturnButtonContainer = styled.View`
	width: 90%;
	height: 8%;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
`;

const ReturnButton = styled.TouchableOpacity`
	width: 15%;
	height: 80%;
	background-color: #872121;
	border-radius: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const InputContainer = styled.View`
	height: 60px;
	width: 90%;
	padding-left: 7px;
	border-bottom-width: 2px;
	border-color: lightgreen;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: flex-end;
	padding-bottom: 5px;
`;

const CurrenctyContainer = styled.Text`
	width: 15%;
	font-size: 30px;
	color: white;
`;

const InputField = styled.TextInput`
	width: 80%;
	border: none;
	font-size: 30px;
	color: white;
	font-size: 30px;
`;

const RightIcon = styled.TouchableOpacity`
	position: absolute;
	top: 25%;
	right: 0;
	z-index: 9;
	height: 90%;
	width: 50px;
	border-color: gray;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const QuickSelectionsContainer = styled.ScrollView`
	width: 95%;
	height: 30px;
	margin-top: 20px;
	display: flex;
	flex-direction: row;
	overflow-x: scroll;
`;

const QuickSelection = styled.TouchableOpacity`
	width: 100px;
	height: 11%;
	background-color: #872121;
	border-radius: 10%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 15px;
`;

const RechargeButtonContianer = styled.TouchableOpacity`
	position: absolute;
	bottom: 10%;
	width: 60%;
	height: 9%;
	border-radius: 30%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;

const TextContainer = styled.Text`
	margin: 0 !important;
	padding: 0 !important;
	color: white;
	font-size: 23px;
`;
