import { Text, Modal, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import axios from "axios";
import config from "../../config";
import { showMessage } from "react-native-flash-message";
import { useDispatch } from "react-redux";
import {
	setDestination,
	setOrigin,
	setRideLiftID,
	setTimeOfDeparture,
	setVehicleID,
	setAcceptableRadius,
} from "../slices/RideLiftSlice.js";
import { useNavigation } from "@react-navigation/native";
import NumericInput from "react-native-numeric-input";
import ShowAllPotentialPassengers from "./ShowAllPotentialPassengers";
import formatDate from "../services/FormatDateTime";

const ShowAllLiftRequests = () => {
	const dispatch = useDispatch();
	const navigation = useNavigation();

	const [rideDetailsModalVisible, setRideDetailsModalVisibility] =
		useState(false);
	const [serverData, setServerData] = useState([]);
	const [itemDetails, setItemDetails] = useState();

	const handleShowPassengers = (pickUp, dest, time, radius) => {
		dispatch(
			setOrigin({
				location: {
					lat: pickUp.lat,
					lng: pickUp.lng,
				},
			})
		);
		dispatch(
			setDestination({
				location: {
					lat: dest.lat,
					lng: dest.lng,
				},
			})
		);
		dispatch(setTimeOfDeparture(time));
		dispatch(setAcceptableRadius(radius));
		setRideDetailsModalVisibility(false);
		navigation.navigate(ShowAllPotentialPassengers);
	};

	const handelUpdate = (vehicle, ori, dest, time, id) => {
		dispatch(setVehicleID(vehicle));
		dispatch(
			setOrigin({
				location: {
					lat: ori.lat,
					lng: ori.lng,
				},
			})
		);
		dispatch(
			setDestination({
				location: {
					lat: dest.lat,
					lng: dest.lng,
				},
			})
		);
		dispatch(setTimeOfDeparture(time));
		dispatch(setRideLiftID(id));
		setRideDetailsModalVisibility(false);
		navigation.navigate("ShowAllUserVehicles", { isUpdating: true });
	};

	const RaduisLimitAlert = () =>
		Alert.alert("Oops", "Radius can't be less than 0 and greater than 200!", [
			{
				text: "OK",
				style: "cancel",
			},
		]);

	const LiftDeleteAlertMessage = (liftID) =>
		Alert.alert("Are you sure?", "You are about to delete a lift!", [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "OK",
				onPress: () => {
					axios
						.delete(
							`${config.KMALAE_DOMAIN}/api/recomm/cancelLiftRequest`,
							{
								data: {
									liftRequestID: `${liftID}`,
								},
							}
						)
						.then(() => {
							showMessage({
								message: "Lift Deleted Successfully",
								type: "success",
							});
							axios
								.get(
									`${config.KMALAE_DOMAIN}/api/recomm/getUserLiftRequests`
								)
								.then((res) => {
									setServerData(res.data);
								})
								.catch((error) =>
									console.log(
										"Axios - Ger Rides: ",
										error.response.data.errors
									)
								);
						})
						.catch((error) =>
							console.log(
								"Axios - Delete Ride: ",
								error.response.data.errors
							)
						);
					setRideDetailsModalVisibility(false);
				},
			},
		]);

	useEffect(() => {
		axios
			.get(`${config.KMALAE_DOMAIN}/api/recomm/getUserLiftRequests`)
			.then((res) => {
				setServerData(res.data);
			});
	}, [serverData.status]);

	function ModalView({ item, modalVisible, onClose }) {
		const [radius, setRadius] = useState({ value: 5 });
		return (
			<View>
				{item && (
					<Modal
						animationType="slide"
						transparent={true}
						visible={modalVisible}
						onRequestClose={() => {
							onClose();
						}}>
						<RideModalView>
							<ModalRowView>
							<DescriptionText>FROM</DescriptionText>
								<ValueText>{item.currentLocation.lat}{item.currentLocation.lng}</ValueText>
							</ModalRowView>
							<BorderLine/>
							<ModalRowView>
							<DescriptionText>TO</DescriptionText>
								<ValueText>{item.destination.lat}{item.destination.lng}</ValueText>
							</ModalRowView>
							<BorderLine/>
							<ModalRowView>
							<DescriptionText>TIME</DescriptionText>
								<ValueText>{formatDate(item.timeOfDeparture)}</ValueText>
							</ModalRowView>
							<BorderLine/>
							<ModalRowView>
							<DescriptionText>STATUS</DescriptionText>
								<ValueText>{item.status}</ValueText>
							</ModalRowView>
							<BorderLine/>
							<ModalRowViewLast>
								<DescriptionText>ACCEPTABLE RADIUS (KM)</DescriptionText>
								<NumericInput
									value={radius.value}
									onChange={(value) => setRadius({ value })}
									onLimitReached={(isMax, msg) => RaduisLimitAlert()}
									minValue={1}
									maxValue={200}
									totalWidth={96}
									totalHeight={34}
									iconSize={25}
									step={1}
									valueType="real"
									rounded
									textColor="white"
									iconStyle={{ color: "black" }}
									rightButtonBackgroundColor="#D1D3D4"
									leftButtonBackgroundColor="#D1D3D4"
								/>
							</ModalRowViewLast>
							<BorderLine/>
							<ButtonsModalRowView>
								<InModalButton
									onPress={() => {
										onClose();
									}}>
									<ButtonText>Close</ButtonText>
								</InModalButton>

								<InModalButton
									onPress={() => {
										handelUpdate(
											item.vehicle,
											item.currentLocation,
											item.destination,
											item.timeOfDeparture,
											item.id
										);
									}}>
									<ButtonText>Update</ButtonText>
								</InModalButton>

								<InModalButton
									onPress={() => {
										LiftDeleteAlertMessage(item.id);
									}}>
									<ButtonText>Delete</ButtonText>
								</InModalButton>
							</ButtonsModalRowView>
							<ButtonsModalRowView>
								<InModalButtonPotential
									style={{ marginLeft: "auto", marginRight: "auto" }}
									onPress={() =>
										handleShowPassengers(
											item.currentLocation,
											item.destination,
											item.timeOfDeparture,
											radius.value
										)
									}>
									<ButtonText>Show Potential Passengers</ButtonText>
								</InModalButtonPotential>
							</ButtonsModalRowView>
					

						
						</RideModalView>
					</Modal>
				)}
			</View>
		);
	}

	return (
		<>
		<FirstView>
			<HeaderText>All Lift Requests</HeaderText>
			</FirstView>
			<SecondView>
				<RidesFlatList
					data={serverData}
					keyExtractor={(item) => item.id}
					ListEmptyComponent={
						<Text
							style={{
								marginLeft: "auto",
								marginRight: "auto",
								marginTop: "50%",
							}}>
							No lifts to show
						</Text>
					}
					renderItem={({ item: { timeOfDeparture, status }, item }) => (
						<RideTouchOpacity
							onPress={() => {
								setRideDetailsModalVisibility(true);
								setItemDetails(item);
							}}>
							<RideItem>{formatDate(timeOfDeparture)}</RideItem>
							<RideItem>{status}</RideItem>
						</RideTouchOpacity>
					)}
				/>
				<ModalView
					item={itemDetails}
					modalVisible={rideDetailsModalVisible}
					onClose={() => {
						setRideDetailsModalVisibility(false);
					}}
				/>
			</SecondView>
		</>
	);
};

const HeaderText = styled.Text`
	color: white;
	font-weight: 600;
	font-size: 25%;
`;

const RidesFlatList = styled.FlatList`
	width: 95%;
	${"" /* border: 2px solid red; */}
	margin: 0 auto;
`;
const FirstView = styled.View`
	height: 20%;
	width: 100%;
	align-items: center;
	justify-content: center;
	background-color: #8B0000;
	
`
const SecondView = styled.View`
	height: 80%;
	width: 100%;
	align-items: center;
	padding-top: 4%;
	background-color: black;
`
const RideTouchOpacity = styled.TouchableOpacity`
	display: flex;
	${'' /* background-color: #6905E8; */}
	background-color: #154360 ;
	${'' /* background-color: #1B2631; */}
	padding: 2.5%;
	width: 90%;
	${'' /* height: 40; */}
	border-radius: 5px;
	margin: 0 auto 3% auto;
	border: 1px solid yellow;
	flex-direction: row;
	justify-content: space-between;
`;

const RideItem = styled.Text`
	height: 100%;
	color: white;
`;


const RideModalView = styled.View`
	${'' /* background-color: #154360 ; */}
	background-color: #1B2631;
	${'' /* margin: 50% auto 0 auto; */}
	padding: 5%;
	width: 90%;
	height: 50%;
	align-items: center;
	margin-top: 60%;
	margin-left: 4%;
	border-radius: 20%;
`;
const ModalRowView = styled.View`
	width: 100%;
	height: 8%;
	justify-content: space-between;
	margin-top: 2%;
	background-color: #1B2631;
	align-items: center;
`;
const ModalRowViewLast = styled.View`
	width: 100%;
	height: 15%;
	justify-content: space-between;
	margin-top: 2%;
	background-color: #1B2631;
	align-items: center;
`;
const BorderLine  = styled.View`
	background-color: grey;
	width: 90%;
	margin-left: 5%;
	height: 0.5%;
	margin-bottom: 3%;
	margin-top: 2%;
`
const DescriptionText = styled.Text`
	opacity: 0.7;
	color: white;
	font-size: 12%;
`
const ValueText = styled.Text`
	font-size: 15%;
	color: white;
`
const ButtonsModalRowView = styled.View`
		${'' /* display: flex; */}
	width: 100%;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 2%;
`;
const InModalButton = styled.TouchableOpacity`
	background-color: green;
	padding: 3%;
	width: 30%;
	margin-left: 2%;
	border-radius: 10%;
	align-items: center;
	`;
const InModalButtonPotential= styled.TouchableOpacity`
	background-color: green;
	padding: 3%;
	width: 80%;
	margin-left: 2%;
	margin-top: 2%;
	margin-bottom: 2%;
	border-radius: 10%;
	align-items: center;
	`;
const ButtonText = styled.Text`
	font-weight: 500;
	color: white;
`
export default ShowAllLiftRequests;
