import { View, StyleSheet, Text, Image } from "react-native";
import { useState } from "react";
import styled from "styled-components";
import "react-native-gesture-handler";
import { useSelector } from "react-redux";
import {
	selectTravelTimeInformation,
	selectAvatarID,
	selectName,
	selectAmount,
	selectDestination,
} from "../slices/ReviewSlice";

const UserDetails = () => {
	const avatarID = useSelector(selectAvatarID);
	const name = useSelector(selectName);
	const destination = useSelector(selectDestination);
	const amount = useSelector(selectAmount);
	const travelTimeInformation = useSelector(selectTravelTimeInformation);

	return (
		<View>
			<ReviewerDetails>
				<FirstBlock>
					<Image source={{}}></Image>
					<Name>
						<Text style={styles.textStyle}>{name}</Text>
					</Name>
				</FirstBlock>
				<ReviewerTextStyleWrapper>
					<TopText>Destination</TopText>
					<ReviewerTextStyle>{destination}</ReviewerTextStyle>
				</ReviewerTextStyleWrapper>

				<ReviewerTextStyleWrapper>
					<TopText>Date</TopText>
					<ReviewerTextStyle>{travelTimeInformation}</ReviewerTextStyle>
				</ReviewerTextStyleWrapper>
				<ReviewerTextStyleWrapper>
					<TopText>Amount Paid</TopText>
					<ReviewerTextStyle>{amount} AED </ReviewerTextStyle>
				</ReviewerTextStyleWrapper>
				<VehicleDetails>
					<ImageVehicle
						source={require("../../assets/images/sizer/vehicle01.jpg")}></ImageVehicle>
					<VehicleDescription>Bugatti Veyron </VehicleDescription>
				</VehicleDetails>
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

const Name = styled.View`
	position: absolute;
	width: 90%;
	margin-top: 5%;
	margin-left: 10%;
`;
const TopText = styled.Text`
	opacity: 0.4;
	font-size: 12px;
	padding-bottom: 1%;
`;
const ReviewerTextStyle = styled.Text`
	color: "black";
	font-size: 15px;
`;
const ReviewerTextStyleWrapper = styled.View`
	width: 50%;
	borderbottomwidth: 1%;
	borderbottomcolor: "grey";
	padding-top: 1.5%;
	padding-bottom: 1.5%;
	opacity: 0.8;
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
	background-color: #FEF5E7;
	${"" /* background-color: #F5B7B1; */};
	background-color: #b1f5d9;
	${"" /* background-color: #CDF5B1; */}
	${"" /* background-color: #F5D9B1; */}
`;

const FirstBlock = styled.View`
	margin-top: 10%;
`;

const VehicleDetails = styled.View`
	position: absolute;
	margin-left: 55%;
	margin-top: 40%;
	height: 45%;
	width: 55%;
	${"" /* background-color: red; */}
`;
const ImageVehicle = styled.Image`
	width: 80%;
	height: 80%;
	margin-left: 15%;
	border-radius: 10%;
`;
const VehicleDescription = styled.Text`
	margin-top: 2%;
	margin-left: 19%;
	font-size: 15px;
	font-weight: 600px;
`;
export default UserDetails;
