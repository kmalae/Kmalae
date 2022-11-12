import {
	View,
	Text,
	StyleSheet,
	ImageBackground,
	SafeAreaView,
	TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Image, Icon } from "react-native-elements";
import styled from "styled-components";
import axios from "axios";
import config from "../../config";

// importing navigations
import Main from "../navigations/Topup/Main";
import Topup from "../navigations/Topup/Topup";

// importing slices
import { selectCurrentUser, setCurrentUser } from "../slices/CurrentUserSlice";

import {
	selectAmountToTopup,
	selectPoints,
	setPoints,
	setTopupHistory,
} from "../slices/TopupSlice";

const TopupScreen = () => {
	const dispatch = useDispatch();
	const [delay, setDelay] = useState(true);
	const Stack = createNativeStackNavigator();
	const navigator = useNavigation();

	const currentUser = useSelector(selectCurrentUser);
	const points = useSelector(selectPoints);
	const amountToTopup = useSelector(selectAmountToTopup);

	useEffect(() => {
		axios
			.post(`${config.KMALAE_DOMAIN}/api/users/signin`, {
				email: "passenger@kmalae.com",
				password: "password",
			})
			.then((result) => {
				axios
					.get(`${config.KMALAE_DOMAIN}/api/users/currentUser`)
					.then((result) => {
						dispatch(setCurrentUser(result.data));
					});
			});
		setTimeout(() => {
			axios
				.get(`${config.KMALAE_DOMAIN}/api/topup/getUserTopups`)
				.then((result) => {
					dispatch(setPoints(result.data.points));
					dispatch(setTopupHistory(result.data.TopupsPerformed));
				})
				.catch((error) => console.log(error.response.data.errors));
		}, 300);
	}, []);

	const expectedAmountCalculator = () => {
		let sum = parseInt(points) + parseFloat(amountToTopup) * 100;
		return sum / 100;
	};

	return (
		<View style={styles.outerContainer}>
			<ImageBackground
				source={require("../../assets/images/kmalae-bg.png")}
				style={styles.backgroundImage}
			></ImageBackground>
			<View style={styles.fader}></View>
			<View style={styles.container}>
				<BalanceContainer>
					<TextContainer
						style={{
							fontSize: 40,
						}}
					>
						AED
					</TextContainer>
					<AmountAvailable>
						{points && (
							<>
								<TextContainer style={{ fontSize: 150 }}>
									{Math.floor(
										(parseInt(points) / 100).toLocaleString("en-US", {
											minimumIntegerDigits: 2,
											useGrouping: false,
										})
									)}
								</TextContainer>
								<TextContainer style={{ fontSize: 40 }}>
									{(parseInt(points) % 100).toLocaleString("en-US", {
										minimumIntegerDigits: 2,
										useGrouping: false,
									})}
								</TextContainer>
							</>
						)}
					</AmountAvailable>
					<ExpectedAmountContainer>
						{amountToTopup !== null && (
							<TextContainer style={{ fontSize: 20 }}>
								Expected amount: AED{" "}
								{expectedAmountCalculator().toLocaleString("en-US", {
									minimumIntegerDigits: 2,
									minimumFractionDigits: 2,
									useGrouping: false,
								})}
							</TextContainer>
						)}
					</ExpectedAmountContainer>
				</BalanceContainer>

				<StackNavigationContainer>
					<Stack.Navigator>
						<Stack.Screen
							name="Main"
							options={{
								headerShown: false,
							}}
						>
							{(props) => <Main delay={delay} setDelay={setDelay} />}
						</Stack.Screen>

						<Stack.Screen
							name="Topup"
							options={{
								headerShown: false,
							}}
						>
							{(props) => <Topup delay={delay} setDelay={setDelay} />}
						</Stack.Screen>
					</Stack.Navigator>
				</StackNavigationContainer>
			</View>
		</View>
	);
};

export default TopupScreen;

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
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
	},
});

const BalanceContainer = styled.View`
	width: 100%;
	height: 300px;
	padding-top: 15%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border-bottom-left-radius: 30%;
	border-bottom-right-radius: 30%;
	background-color: #872121;
`;

const AmountAvailable = styled.View`
	width: 80%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;

const TextContainer = styled.Text`
	margin: 0 !important;
	padding: 0 !important;
	color: white;
`;

const ExpectedAmountContainer = styled.View`
	width: 80%;
	height: 10%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const StackNavigationContainer = styled.View`
	height: 65%;
	width: 100%;
	display: flex;
	flex-direction: column;
`;
