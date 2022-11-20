import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Image } from "react-native-elements";
import styled from "styled-components";
import axios from "axios";
import { useSelector } from "react-redux";
import {
	selectTravelTimeInformation,
	selectAvatarID,
	selectdriverId,
	selectmatchId,
	selectName,
	selectAmount,
	selectDestination,
} from "../slices/PaymentSlice";
import config from "../../config";
import { AvatarImages } from "../../Avatars";
import { useEffect, useState } from "react";

const PaymentPart = () => {
	const avatarID = useSelector(selectAvatarID);
	const driverId = useSelector(selectdriverId);
	const matchId = useSelector(selectmatchId);
	const name = useSelector(selectName);
	const destination = useSelector(selectDestination);
	const amount = useSelector(selectAmount);
	const travelTimeInformation = useSelector(selectTravelTimeInformation);
	const [avatarImageURI, setAvatarImageURI] = useState(null);

	useEffect(() => {
		if (avatarID !== null)
			AvatarImages.map(({ id, image }) => {
				if (id == avatarID) setAvatarImageURI(image);
			});
	}, [avatarID]);

	const completePayment = async () => {
		axios
			.post(`${config.KMALAE_DOMAIN}/api/payment/deductPoints`, {
				driverID: driverId,
				matchRequestID: matchId,
				amountPaid: amount,
			})
			.then((response) => navigator.replace("ReviewScreen"))
			.catch((error) => console.log(error.response.data.errors));
	};

	return (
		<View>
			<ReviewerDetails>
				<DriverSection>
					<DriverName>Driver</DriverName>
					<DriverImage>
						<AvatarContainer>
							{avatarImageURI !== null && (
								<AvatarImage
									source={{
										uri: Image.resolveAssetSource(avatarImageURI).uri,
									}}
									resizeMode="contain"
								/>
							)}
						</AvatarContainer>
					</DriverImage>
					<DriverName>{name}</DriverName>
				</DriverSection>
				<BorderLine></BorderLine>
				<DetailsSection>
					<DestinationSection>
						<DestinationText>Destination</DestinationText>
						<RealDestination>{destination}</RealDestination>
					</DestinationSection>
					<BorderLine></BorderLine>
					<TimeSection>
						<TimeText>Date</TimeText>
						<RealTime>{travelTimeInformation}</RealTime>
					</TimeSection>
					<BorderLine></BorderLine>
					<AmountSection>
						<AmountText>Amount </AmountText>
						<RealAmount>{amount}</RealAmount>
					</AmountSection>
					<BorderLine></BorderLine>
				</DetailsSection>
				<PaySection>
					<PayButton onPress={() => completePayment()}>
						<PayText>Pay</PayText>
					</PayButton>
				</PaySection>
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
	avatar: {},
});

const ReviewerDetails = styled.View`
	height: 100%;
	width: 100%;
	z-index: 4;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	padding-horizontal: 3%;
	background-color: black;
`;
const DriverSection = styled.View`
	height: 30%;
	width: 80%;
	${"" /* background-color: red; */}
	margin-top: 3%;
	margin-left: 10%;
	align-items: center;
	margin-bottom: 2%;
`;
const DriverName = styled.Text`
	font-weight: 300;
	font-size: 18%;
	color: yellow;
	${"" /* margin-top: 2%; */}
`;
const DriverImage = styled.View`
	height: 60%;
	width: 80%;
	${"" /* background-color: green; */}
	margin-top: 2%;
	align-items: center;
`;
const DetailsSection = styled.View`
	${"" /* margin-top: 3%; */}
	height: 30%;
	width: 100%;

	${"" /* background-color: yellow; */}
	margin-bottom: 15%;
`;
const DestinationSection = styled.View`
	margin-top: 2%;
	width: 100%;
	height: 40%;
	${"" /* background-color: blue; */}
	${"" /* border: 2px black; */}
	${"" /* border-bottom-color: grey; */}
	align-items: center;
`;
const TimeSection = styled.View`
	margin-top: 2%;
	width: 100%;
	height: 40%;
	${"" /* background-color: blue; */}
	${"" /* border: 2px black; */}
	${"" /* border-bottom-color: grey; */}
	align-items: center;
`;
const TimeText = styled.Text`
	color: white;
	font-size: 15%;
	opacity: 0.8;
	margin-bottom: 1%;
`;
const RealTime = styled.Text`
	color: white;
	font-size: 22%;
`;
const BorderLine = styled.View`
	height: 0.2%;
	opacity: 0.5;
	width: 90%;
	background-color: grey;
	margin-left: 5%;
`;
const DestinationText = styled.Text`
	color: white;
	font-size: 15%;
	opacity: 0.8;
	margin-bottom: 1%;
`;
const RealDestination = styled.Text`
	color: white;
	font-size: 22%;
`;

const AmountText = styled.Text`
	opacity: 0.8;
	color: white;
	font-size: 15%;
	margin-bottom: 1%;
`;
const RealAmount = styled.Text`
	color: white;
	font-size: 22%;
`;
const AmountSection = styled.View`
	margin-top: 2%;
	width: 100%;
	height: 40%;
	${"" /* background-color: blue; */}
	align-items: center;
`;
const PaySection = styled.View`
	justify-content: center;
	align-items: center;
	margin-top: 8%;
`;
const PayButton = styled.TouchableOpacity`
	justify-content: center;
	align-items: center;
	${"" /* margin-top: 5%; */}
	padding: 10px;
	border-radius: 50%;
	background-color: green;
	width: 40%;
	${"" /* margin-left: 30%; */}
`;
const PayText = styled.Text`
	font-weight: 500;
	color: white;
	${"" /* font-family: sans-serif; */}
	font-size: 20%;
`;
const AvatarContainer = styled.View`
	${"" /* background-color: "#D9D9D9"; */}
	height: 100%;
	width: 89%;
	justify-content: center;
	align-items: center;
`;

const AvatarImage = styled.Image`
	height: 100%;
	width: 70%;
`;

export default PaymentPart;
