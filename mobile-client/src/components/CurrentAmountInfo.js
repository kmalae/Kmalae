import { View, StyleSheet, Text, Image } from "react-native";
import { useState, useEffect } from "react";
import styled from "styled-components";
import "react-native-gesture-handler";
import axios from "axios";
import config from "../../config";

const CurrentAmountInfo = () => {
	const [currentAmount, setCurrentAmount] = useState();
	useEffect(() => {
		axios
			.get(`${config.KMALAE_DOMAIN}/api/payment/getUserTopup`, {
				id: "63590e11f5fdd2a3ba3d1c4f",
				email: "passenger@kmalae.com",
			})
			.then((response) => {
				setCurrentAmount(response.data.points);
			});
	});

	return (
		<View>
			<ReviewerDetails>
				<CurrencySection>
					<CurrencyText>AED</CurrencyText>
				</CurrencySection>
				<AmountSection>
					<AmountText>{currentAmount / 100}</AmountText>
				</AmountSection>
				<CurrentAvailableSection>
					<CurrentAvailable>Current Available Amount</CurrentAvailable>
				</CurrentAvailableSection>
			</ReviewerDetails>
		</View>
	);
};

const styles = StyleSheet.create({
	textStyle: {
		marginTop: 15,
		textAlign: "center",
		fontSize: 15,
		// fontFamily: 'serif',
		fontWeight: "bold",
	},
});

const CurrencyText = styled.Text`
	font-weight: 300;
	font-size: 30%;
	color: white;
`;
const CurrencySection = styled.View`
	margin-top: 13%;
	height: 15%;
	width: 100%;
	align-items: center;
	justify-content: center;
`;
const AmountSection = styled.View`
	height: 40%;
	align-items: center;
	justify-content: center;
`;
const AmountText = styled.Text`
	font-weight: 600;
	font-size: 100%;
	color: white;
`;
const CurrentAvailable = styled.Text`
	color: white;
	font-size: 18%;
	opacity: 0.6;
`;
const CurrentAvailableSection = styled.View`
	height: 20%;
	align-items: center;
	justify-content: center;
`;

const ReviewerDetails = styled.View`
	height: 100%;
	width: 100%;
	z-index: 4;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	padding-horizontal: 3%;
	${"" /* background-color: #EBF5FB; */}
	${"" /* background-color: #FEF5E7; */}
	${"" /* background-color: #F5B7B1; */};
	${"" /* background-color: #b1f5d9; */}
	background-color: #8B0000;
	${"" /* background-color: #F5D9B1; */}
`;

export default CurrentAmountInfo;
