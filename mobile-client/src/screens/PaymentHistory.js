import {
	View,
	Text,
	FlatList,
	Image,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components";
import axios from "axios";
import config from "../../config";
import tw from "tailwind-react-native-classnames";
import CurrentAmountInfo from "../components/CurrentAmountInfo";
import { useDispatch } from "react-redux";
import {
	// setId,
	setImage,
	setName,
	setDestination,
	setAmount,
	setTravelTimeInformation,
} from "../slices/PaymentSlice";

const PaymentHistory = () => {
	const [paymentInfo, setPaymentInfo] = useState();
	const dispatch = useDispatch();
	const navigation = useNavigation();

	useEffect(() => {
		axios
			.get(`${config.KMALAE_DOMAIN}/api/payment/getPaymentInfo`, {
				id: "63590e11f5fdd2a3ba3d1c4f",
				email: "passenger@kmalae.com",
			})
			.then((response) => console.log(response.data));
		// .then(response=> setPaymentInfo(response.data))
		// .then(response=>console.log(response.data)).catch((error) => {
		// 	console.log(error.response.data.errors)
		// 	});
	}, []);

	const paymentDetails = ({ item }) => (
		<Item
			onPress={() => {
				dispatch(setImage(require(`../../assets/images/sizer/person0${3}.png`)));
				dispatch(setName(item.name));
				dispatch(setDestination(item.destination));
				dispatch(setAmount(item.amount));
				dispatch(setTravelTimeInformation(item.date));
				navigation.navigate("PaymentScreen");
			}}>
			<AvatarContainer>
				<Image source={item.image} style={styles.avatar} />
			</AvatarContainer>
			<DetailsItem>
				<NameText>
					{item.driver.firstName} {item.driver.lastName}
				</NameText>
				<AmountText>{item.amount}</AmountText>
				<DestinationText>{item.destination}</DestinationText>
				<DestinationText>{item.date}</DestinationText>

				{/* <NameText>{item.passenger.firstName} {item.passenger.lastName}</NameText>
					<AmountText>{item.payment.amountPaid/100} AED</AmountText>
					<DestinationText>{new Date(item.matchRide.timeOfDeparture).toLocaleDateString()}</DestinationText>
					<DestinationText>{item.matchRide.destination.lat} + {item.matchRide.destination.lng}</DestinationText> */}
			</DetailsItem>
			<PayButton
				onPress={() => {
					navigation.navigate("PaymentScreen");
				}}>
				<PayText>Pay</PayText>
			</PayButton>
		</Item>
	);

	listSeparator = () => {
		return <View style={styles.separator} />;
	};

	return (
		<View>
			<View style={tw`h-1/3`}>
				<CurrentAmountInfo />
			</View>
			<View style={tw`h-2/3`}>
				<ReviewerDetails>
					<FlatList
						ListHeaderComponentStyle={styles.listHeader}
						data={paymentInfo}
						renderItem={paymentDetails}
						ItemSeparatorComponent={listSeparator}
					/>
					<TouchableOpacity activeOpacity={0.7} style={styles.buttonStyle}>
						<Text style={styles.buttonTextStyle}>Top up</Text>
					</TouchableOpacity>
				</ReviewerDetails>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: 21,
	},

	listHeader: {
		height: 55,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#7B52AB",
	},

	listHeadline: {
		color: "#333333",
		fontWeight: "bold",
		fontSize: 21,
	},
	avatar: {
		height: 55,
		width: 55,
	},
	separator: {
		height: 1,
		width: "100%",
		backgroundColor: "#CCC",
	},
	textStyle: {
		marginTop: 15,
		textAlign: "center",
		fontSize: 20,
		fontWeight: "bold",
	},
	buttonTextStyle: {
		textAlign: "center",
		fontSize: 20,
		color: "white",
	},
	buttonStyle: {
		justifyContent: "center",
		alignItems: "center",
		marginTop: 19,
		marginBottom: 155,
		marginLeft: 120,
		marginRight: 120,
		padding: 10,
		borderRadius: 10,
		backgroundColor: "green",
	},
});
const Item = styled.TouchableOpacity`
	flex: 1;
	align-items: "center";
	align-content: "center";
	padding-vertical: 5%;
`;
const PayText = styled.Text`
	color: white;
	font-weight: 700;
`;
const DetailsItem = styled.View`
	height: 100%;
	width: 70%;
	margin-left: 20%;
	margin-top: 5%;
	margin-bottom: 35%;
	position: absolute;
`;

const NameText = styled.Text`
	font-weight: 600;
	font-size: 15px;
	margin-left: 5%;
	padding-bottom: 2%;
	color: white;
`;
const AmountText = styled.Text`
	font-weight: 600;
	font-size: 12px;
	margin-left: 80%;
	position: absolute;
	color: white;
`;
const DestinationText = styled.Text`
	font-weight: 300;
	font-size: 12px;
	margin-left: 13px;
	padding-bottom: 2%;
	color: grey;
`;
const AvatarContainer = styled.View`
	background-color: "#D9D9D9";
	border-radius: 100%;
	height: 59%;
	width: 59%;
	justify-content: "center";
	align-items: "center";
`;

const Name = styled.View`
	position: absolute;
	width: 90%;
	margin-top: 5%;
	margin-left: 10%;
`;
const TopText = styled.Text`
	margin-top: 3%;
	opacity: 0.4;
	font-size: 15px;
	padding-bottom: 1%;
	text-align: center;
`;
const ReviewerTextStyle = styled.Text`
	color: "black";
	font-size: 17px;
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
	background-color: black;
	${"" /* background-color: #EBF5FB; */}
	${"" /* background-color: #FEF5E7; */}
	${"" /* background-color: #F5B7B1; */};
	${"" /* background-color: #b1f5d9; */}
	${"" /* background-color: #CDF5B1; */}
	${"" /* background-color: #F5D9B1; */}
`;
const ButtonContainer = styled.View`
	height: 100%;
	width: 100%;
	${"" /* background-color: red; */}
	${"" /* align-items: center; */}
	${"" /* align-content: center; */}
`;
const FilterButtonDriver = styled.TouchableOpacity`
	position: absolute;
	margin-top: 3%;
	border-radius: 10%;
	background-color: green;
	width: 25%;
	height: 33%;
	margin-left: 5%;
	align-items: center;
	align-content: center;
	padding: 2%;
`;
const FilterButtonPassenger = styled.TouchableOpacity`
	${"" /* position: absolute; */}
	margin-top: 3%;
	border-radius: 10%;
	background-color: green;
	width: 35%;
	height: 45%;
	margin-left: 50%;
	align-items: center;
	padding: 1%;
`;
const PayButton = styled.TouchableOpacity`
	${"" /* position: absolute; */}
	margin-top: 3%;
	border-radius: 10%;
	background-color: green;
	width: 15%;
	height: 35%;
	margin-left: 70%;
	margin-top: 12%;
	align-items: center;
	padding: 1%;
	position: absolute;
`;
const TextButton = styled.Text`
	color: white;
	text-align: "center";
`;
const FirstBlock = styled.View`
	margin-top: 10%;
	margin-bottom: 20%;
`;

export default PaymentHistory;
