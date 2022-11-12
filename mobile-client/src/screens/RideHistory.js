import { useNavigation } from "@react-navigation/native";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	// Image
} from "react-native";
import { Image } from "react-native-elements";
import { useState, useEffect } from "react";
import styled from "styled-components";
import ReviewScreen from "./ReviewScreen";
import { useDispatch } from "react-redux";
import {
	// setId,
	setImage,
	setName,
	setDestination,
	setAmount,
	setTravelTimeInformation,
	setStand,
	setmatchRide,
	setcommentedId,
} from "../slices/ReviewSlice";
import { useSelector } from "react-redux";
import axios from "axios";
import config from "../../config";

const RideHistory = () => {
	const [state, setState] = useState(null);
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const [review, setReview] = useState();

	const base64Converter = ({ data, contentType }, setState) => {
		// console.log({contentType});
		const blob = new Blob([data.data], { type: contentType });
		// console.log(blob);
		const fileReaderInstance = new FileReader();
		fileReaderInstance.readAsDataURL(blob);
		fileReaderInstance.onloadend = () => {
			// console.log("really entered here")
			const base64data = fileReaderInstance.result;
			setState(base64data);
			return;
		};
	};

	let stand = "";
	const fetchReview = async (stance) => {
		if (stance == "driver") {
			stand = "driver";
		} else {
			stand = "passenger";
		}
		await axios
			.post(`${config.KMALAE_DOMAIN}/api/review/getUserReviews`, {
				stance: stance,
			})
			.then((response) => setReview(response.data));
	};
	headerComponent = () => {
		return (
			<ButtonContainer>
				<FilterButtonDriver onPress={() => fetchReview("driver")}>
					<TextButton>As Driver</TextButton>
				</FilterButtonDriver>
				<FilterButtonPassenger onPress={() => fetchReview("passenger")}>
					<TextButton>As Passenger</TextButton>
				</FilterButtonPassenger>
			</ButtonContainer>
		);
	};

	listSeparator = () => {
		return <View style={styles.separator} />;
	};

	return (
		<View>
			<ReviewerDetails>
				<FirstBlock>
					<AvatarContainer>
						<Image
							source={require("../../assets/images/sizer/person02.png")}
						/>
					</AvatarContainer>
					<Name>
						<Text style={styles.textStyle}>Amanda John</Text>
					</Name>
				</FirstBlock>
				<FlatList
					ListHeaderComponentStyle={styles.listHeader}
					ListHeaderComponent={headerComponent}
					data={review}
					renderItem={({ item }) => {
						base64Converter(item.passenger.userImage, setState);
						// console.log(state)
						return (
							<Item
								onPress={() => {
									dispatch(
										setImage(
											require(`../../assets/images/sizer/person0${3}.png`)
										)
									);
									dispatch(
										setName(
											item.passenger.firstName +
												" " +
												item.passenger.lastName
										)
									);
									dispatch(
										setDestination(
											item.matchRide.destination.lat +
												item.matchRide.destination.lng
										)
									);
									dispatch(setAmount(item.payment.amountPaid / 100));
									dispatch(
										setTravelTimeInformation(
											new Date(
												item.matchRide.timeOfDeparture
											).toLocaleDateString()
										)
									);

									dispatch(setmatchRide(item.matchRide.id));
									if (stand == "driver") {
										dispatch(setcommentedId(item.passenger.id));
									} else {
										dispatch(setcommentedId(item.driver.id));
									}
									dispatch(setStand(stand));

									// console.log(item.passenger.id);
									navigation.navigate("ReviewScreen");
								}}>
								<AvatarContainer>
									<Image source={state} style={styles.avatar} />
								</AvatarContainer>
								<DetailsItem>
									<NameText>
										{item.passenger.firstName}{" "}
										{item.passenger.lastName}
									</NameText>
									<AmountText>
										{item.payment.amountPaid / 100} AED
									</AmountText>
									<DestinationText>
										{new Date(
											item.matchRide.timeOfDeparture
										).toLocaleDateString()}
									</DestinationText>
									<DestinationText>
										{item.matchRide.destination.lat} +{" "}
										{item.matchRide.destination.lng}
									</DestinationText>
								</DetailsItem>
							</Item>
						);
					}}
					ItemSeparatorComponent={listSeparator}
				/>
			</ReviewerDetails>
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
});
const Item = styled.TouchableOpacity`
	flex: 1;
	align-items: "center";
	align-content: "center";
	padding-vertical: 13px;
`;
const DetailsItem = styled.View`
	height: 100%;
	width: 70%;
	margin-left: 20%;
	margin-top: 5%;
	position: absolute;
`;

const NameText = styled.Text`
	font-weight: 600;
	${"" /* font-size: 15px; */}
	font-size: 12px;
	margin-left: 5%;
	padding-bottom: 2%;
`;
const AmountText = styled.Text`
	font-weight: 600;
	${"" /* font-size: 12px; */}
	font-size: 12px;
	margin-left: 80%;
	position: absolute;
`;
const DestinationText = styled.Text`
	font-weight: 300;
	${"" /* font-size: 12px; */}
	font-size: 12px;
	margin-left: 13px;
	padding-bottom: 2%;
`;
const AvatarContainer = styled.View`
	background-color: "#D9D9D9";
	border-radius: 100%;
	height: 12%;
	width: 12%;
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
	opacity: 0.4;
	font-size: 12px;
	padding-bottom: 1%;
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
	${"" /* background-color: #EBF5FB; */}
	background-color: #FEF5E7;
	${"" /* background-color: #F5B7B1; */};
	background-color: #b1f5d9;
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
const TextButton = styled.Text`
	color: white;
	text-align: "center";
`;
const FirstBlock = styled.View`
	margin-top: 10%;
`;

export default RideHistory;
