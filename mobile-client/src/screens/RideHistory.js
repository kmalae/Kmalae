import { useNavigation } from "@react-navigation/native";
import { View, FlatList, StyleSheet } from "react-native";
import { Image } from "react-native-elements";
import { useState, useEffect } from "react";
import tw from "tailwind-react-native-classnames";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import {
	setAvatarID,
	setName,
	setDestination,
	setAmount,
	setTravelTimeInformation,
	setStand,
	setmatchRide,
	setcommentedId,
	setreviewId,
} from "../slices/ReviewSlice";
import axios from "axios";
import config from "../../config";

import { AvatarImages } from "../../Avatars";

const RideHistory = () => {
	// let standd = "";
	const [standd, setStandd] = useState();
	const [state, setState] = useState(null);
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const [review, setReview] = useState();
	const [userFirstData, setFirstUserData] = useState();
	const [userLastData, setLastUserData] = useState();
	// const [avatarID, setAvatarID] = useState(null);
	const [avatarImageURI, setAvatarImageURI] = useState(null);

	useEffect(() => {
		axios
			.get(`${config.KMALAE_DOMAIN}/api/users/getInfo`)
			.then((response) => {
				setFirstUserData(response.data.firstName);
				setLastUserData(response.data.lastName);
				// setAvatarID(response.data.avatarID);
			});
	}, []);

	// useEffect(() => {
	// 	if (avatarID !== null)
	// 		AvatarImages.map(({ id, image }) => {
	// 			if (id == avatarID) setAvatarImageURI(image);
	// 		});
	// }, [avatarID]);

	const fetchReview = async (stance) => {
		setReview(null);
		await axios
			.post(`${config.KMALAE_DOMAIN}/api/review/getUserReviews`, {
				stance: stance,
			})
			.then((response) => setReview(response.data))
			.catch((error) => {
				console.log(error.response.data.errors);
			});
	};

	listSeparator = () => {
		return <View style={styles.separator} />;
	};

	return (
		<>
			<View style={tw`h-1/3`}>
				<FirstBlock>
					{/* <AvatarContainer>
						{avatarImageURI !== null && (
							<AvatarImage
								source={{
									uri: Image.resolveAssetSource(avatarImageURI).uri,
								}}
								resizeMode="contain"
							/>
						)}
					</AvatarContainer> */}
					<Name>
						<NameTextTop>
							{userFirstData} {userLastData}
						</NameTextTop>
					</Name>
					<ButtonContainer>
						<FilterButtonDriverContainer>
							<FilterButton
								onPress={() => {
									fetchReview("driver");
									setStandd("driver");
								}}>
								<TextButton>As Driver</TextButton>
							</FilterButton>
						</FilterButtonDriverContainer>
						<FilterButtonPassengerContainer>
							<FilterButton
								onPress={() => {
									fetchReview("passenger");
									setStandd("passenger");
								}}>
								<TextButton>As Passenger</TextButton>
							</FilterButton>
						</FilterButtonPassengerContainer>
					</ButtonContainer>
				</FirstBlock>
			</View>
			<View style={tw`h-2/3`}>
				<ReviewerDetails>
					<FlatList
						ListHeaderComponentStyle={styles.listHeader}
						// ListHeaderComponent={headerComponent}
						data={review}
						renderItem={({ item }) => {
							let imageURI;
							AvatarImages.map(({ id, image }) => {
								if (standd == "driver") {
									if (id == item.passenger.avatarID) imageURI = image;
								} else {
									if (id == item.driver.avatarID) imageURI = image;
								}
							});
							return (
								<Item
									onPress={() => {
										dispatch(
											setAvatarID(
												standd == "driver"
													? item.passenger.avatarID
													: item.driver.avatarID
											)
										);

										dispatch(
											setDestination(
												item.matchRide.destination.lat +
													item.matchRide.destination.lng
											)
										);
										dispatch(setAmount(item.matchRide.amountPaid));
										dispatch(
											setTravelTimeInformation(
												new Date(
													item.matchRide.timeOfDeparture
												).toLocaleDateString()
											)
										);
										dispatch(setreviewId(item.id));

										dispatch(setmatchRide(item.matchRide.id));
										if (standd == "driver") {
											dispatch(
												setName(
													item.passenger.firstName +
														" " +
														item.passenger.lastName
												)
											);
											dispatch(setcommentedId(item.passenger.id));
										} else {
											dispatch(setcommentedId(item.driver.id));
											dispatch(
												setName(
													item.driver.firstName +
														" " +
														item.driver.lastName
												)
											);
										}
										dispatch(setStand(standd));
										navigation.navigate("ReviewScreen");
									}}>
									<AvatarContainer>
										<AvatarImage
											source={{
												uri: Image.resolveAssetSource(imageURI).uri,
											}}
											resizeMode="contain"
										/>
									</AvatarContainer>
									<DetailsItem>
										<NameText>
											{standd == "driver"
												? item.passenger.firstName
												: item.driver.firstName}
										</NameText>

										<AmountText>
											{item.matchRide.amountPaid / 100} AED
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
		</>
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
	separator: {
		height: 1,
		width: "100%",
		backgroundColor: "#CCC",
	},
});

const FirstBlock = styled.View`
	${"" /* margin-top: 10%; */}
	height: 100%;
	background-color: #8b0000;
`;

const Item = styled.TouchableOpacity`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	border: 2px solid white;
	height: 70px;
`;

const DetailsItem = styled.View`
	height: 100%;
	width: 70%;
	margin-left: 20%;
	margin-top: 5%;
	position: absolute;
`;

const NameTextTop = styled.Text`
	font-weight: 600;
	font-size: 20%;
	margin-left: 5%;
	color: white;
`;
const AmountText = styled.Text`
	font-weight: 600;
	${"" /* font-size: 12px; */}
	font-size: 12%;
	margin-left: 80%;
	position: absolute;
	color: white;
`;
const DestinationText = styled.Text`
	font-weight: 300;
	font-size: 12%;
	margin-left: 5%;
	padding-bottom: 2%;
	color: white;
`;
const AvatarContainer = styled.View`
	border-radius: 100%;
	height: 100%;
	width: 80px;
	border: 2px solid white;
`;

const AvatarImage = styled.Image`
	height: 100%;
	width: 70%;
	border: 2px solid red;
`;

const Name = styled.View`
	width: 50%;
	margin-top: 15%;
	margin-left: 40%;
	align-item: center;
	justify-content: center;
`;
const NameText = styled.Text`
	font-size: 16%;
	font-weight: 500;
	color: white;
	margin-left: 2%;
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
	background-color: #fef5e7;
	background-color: #b1f5d9;
	background-color: black;
`;
const ButtonContainer = styled.View`
	height: 50%;
	width: 100%;
	margin-top: 20%;
`;
const FilterButtonDriverContainer = styled.View`
	width: 50%;
	height: 100%;
	align-items: center;
	justify-content: center;
`;
const FilterButtonPassengerContainer = styled.View`
	width: 50%;
	height: 100%;
	align-items: center;
	justify-content: center;

	margin-left: 50%;
	position: absolute;
`;
const FilterButton = styled.TouchableOpacity`
	border-radius: 10%;
	background-color: green;
	width: 75%;
	height: 30%;
	align-items: center;
	align-content: center;
	padding: 2%;
`;

const TextButton = styled.Text`
	color: white;
	text-align: center;
	font-weight: 500;
	font-size: 20%;
`;

export default RideHistory;
