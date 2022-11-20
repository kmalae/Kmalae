import { View, Text } from "react-native";
import React, { useEffect } from "react";
import styled from "styled-components";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const Main = ({ delay, setDelay }) => {
	const navigator = useNavigation();

	useEffect(() => {
		const timer = setTimeout(() => {
			setDelay((current) => false);
		}, 500);
		return () => clearTimeout(timer);
	}, [delay]);

	return (
		!delay && (
			<StackScreenContainer>
				<TopupButtonContainer>
					<IconContainer
						onPress={() => {
							setDelay(() => true);
							navigator.navigate("Topup");
						}}
					>
						<Icon
							name="wallet-outline"
							type="ionicon"
							size={60}
							color="white"
						/>
					</IconContainer>
					<ButtonTextContainer>
						<Text style={{ color: "white", fontSize: 22 }}>Topup</Text>
						<Icon name="add" type="ionicon" size={22} color="white" />
					</ButtonTextContainer>
				</TopupButtonContainer>

				<TopupHistoryContainer
					onPress={() => {
						setDelay(() => true);
						navigator.navigate("TopupHistory");
					}}
				>
					<TextContainer style={{ fontSize: 23 }}>Topup History</TextContainer>
					<Icon name="arrow-right" type="fontawesome" size={35} color="white" />
				</TopupHistoryContainer>
			</StackScreenContainer>
		)
	);
};

export default Main;

const StackScreenContainer = styled.View`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const TextContainer = styled.Text`
	margin: 0 !important;
	padding: 0 !important;
	color: white;
`;

const TopupButtonContainer = styled.View`
	width: 100%;
	height: 25%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const IconContainer = styled.TouchableOpacity`
	height: 65%;
	width: 23%;
	border-radius: 100%;
	background-color: #4f51ed;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 5px;
`;

const ButtonTextContainer = styled.View`
	display: flex;
	flex-direction: row;
`;

const TopupHistoryContainer = styled.TouchableOpacity`
	position: absolute;
	bottom: 8%;
	width: 50%;
	height: 8%;
	background-color: #872121;
	border-radius: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding-left: 10%;
	padding-right: 7%;
`;
