import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Icon } from "react-native-elements";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

// importing slices
import { selectTopupHistory } from "../../slices/TopupSlice";

const TopupHistory = ({ delay, setDelay }) => {
	const navigator = useNavigation();
	let topupHistory = useSelector(selectTopupHistory);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDelay((current) => false);
		}, 500);
		return () => clearTimeout(timer);
	}, [delay]);

	return !delay && topupHistory !== null ? (
		<StackScreenContainer>
			<ReturnButtonContainer>
				<ReturnButton
					onPress={() => {
						setDelay((current) => true);
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
			<TopupHistoryList>
				{topupHistory.map(({ paymentIntent, amount, toppedAt }) => {
					return (
						<TopupHistoryDetail key={paymentIntent}>
							<TextContainer>AED {amount}</TextContainer>
							<TextContainer>
								{new Date(toppedAt).toLocaleString()}
							</TextContainer>
						</TopupHistoryDetail>
					);
				})}
			</TopupHistoryList>
		</StackScreenContainer>
	) : (
		<></>
	);
};

export default TopupHistory;

const StackScreenContainer = styled.View`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
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

const TopupHistoryList = styled.ScrollView`
	width: 90%;
	margin-bottom: 13%;
`;

const TopupHistoryDetail = styled.TouchableOpacity`
	width: 100%;
	height: 65px;
	padding: 5%;
	border-bottom-width: 2px;
	border-color: lightgreen;
	margin-bottom: 20px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;

const TextContainer = styled.Text`
	margin: 0 !important;
	padding: 0 !important;
	color: white;
	font-size: 20px;
`;
