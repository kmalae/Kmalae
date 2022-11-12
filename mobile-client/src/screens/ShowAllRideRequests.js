import { SafeAreaView, Text, Modal, View, Alert } from "react-native";
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
} from "../slices/RideLiftSlice";
import { useNavigation } from "@react-navigation/native";
import formatDate from "../services/FormatDateTime";

const ShowAllRideRequests = () => {
	const dispatch = useDispatch();
	const navigation = useNavigation();

	const [rideDetailsModalVisible, setRideDetailsModalVisibility] =
		useState(false);
	const [serverData, setServerData] = useState([]);
	const [itemDetails, setItemDetails] = useState();

	const handelUpdate = (ori, dest, time, id) => {
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
		navigation.navigate("GetRide", { isUpdating: true });
	};

	const RideDeleteAlertMessage = (rideID) =>
		Alert.alert("Are you sure?", "You are about to delete a ride!", [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "OK",
				onPress: () => {
					axios
						.delete(
							`${config.KMALAE_DOMAIN}/api/rides/cancelRideRequest`,
							{
								data: {
									rideRequestID: `${rideID}`,
								},
							}
						)
						.then(() => {
							showMessage({
								message: "Ride Deleted Successfully",
								type: "success",
							});
							axios
								.get(
									`${config.KMALAE_DOMAIN}/api/rides/getUserRideRequests`
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
			.get(`${config.KMALAE_DOMAIN}/api/rides/getUserRideRequests`)
			.then((res) => {
				setServerData(res.data);
			});
	}, [serverData.status]);

	function ModalView({ item, modalVisible, onClose }) {
		return (
			<View>
				{item && (
					<Modal
						animationType="slide"
						i
						transparent={true}
						visible={modalVisible}
						onRequestClose={() => {
							onClose();
						}}>
						<RideModalView>
							<ModalRowView>
								<Text>From: </Text>
								<Text>{item.pickUpPoint.lat}</Text>
								<Text>{item.pickUpPoint.lng}</Text>
							</ModalRowView>
							<ModalRowView>
								<Text>To: </Text>
								<Text>{item.destination.lat}</Text>
								<Text>{item.destination.lng}</Text>
							</ModalRowView>
							<ModalRowView>
								<Text>Pick up at: </Text>
								<Text>{formatDate(item.timeOfDeparture)}</Text>
							</ModalRowView>
							<ModalRowView>
								<Text>Status: </Text>
								<Text>{item.status}</Text>
							</ModalRowView>

							<ButtonsModalRowView>
								<InModalButton
									onPress={() => {
										onClose();
									}}>
									<Text>Close</Text>
								</InModalButton>

								<InModalButton
									onPress={() => {
										handelUpdate(
											item.pickUpPoint,
											item.destination,
											item.timeOfDeparture,
											item.id
										);
									}}>
									<Text>Update</Text>
								</InModalButton>

								<InModalButton
									onPress={() => {
										RideDeleteAlertMessage(item.id);
									}}>
									<Text>Delete</Text>
								</InModalButton>
							</ButtonsModalRowView>
						</RideModalView>
					</Modal>
				)}
			</View>
		);
	}

	return (
		<SafeAreaView>
			<HeaderText>All Ride Requests</HeaderText>
			<RideRequestsScrollView>
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
							No rides to show
						</Text>
					}
					renderItem={({ item: { timeOfDeparture, status }, item }) => (
						<RideTouchOpacity
							onPress={() => {
								setRideDetailsModalVisibility(true);
								setItemDetails(item);
							}}>
							<RideItem>{formatDate(timeOfDeparture)}</RideItem>
							<Text>{status}</Text>
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
			</RideRequestsScrollView>
		</SafeAreaView>
	);
};

const HeaderText = styled.Text`
	margin: 10% auto 0 auto;
	padding: 5% 0;
`;

const RidesFlatList = styled.FlatList`
	width: 95%;
	${"" /* border: 2px solid red; */}
	margin: 0 auto;
`;

const RideTouchOpacity = styled.TouchableOpacity`
	display: flex;
	background-color: #d1d3d4;
	padding: 2.5%;
	width: 90%;
	height: 40;
	border-radius: 5px;
	margin: 0 auto 3% auto;
	border: 2px solid yellow;
	flexdirection: row;
	justifycontent: space-between;
`;

const RideItem = styled.Text`
	height: 30;
`;

const RideRequestsScrollView = styled.View`
	height: 75%;
`;

const RideModalView = styled.View`
	backgroundcolor: white;
	margin: 50% auto 0 auto;
	padding: 5%;
	width: 90%;
`;
const ModalRowView = styled.View`
	display: flex;
	flexdirection: row;
	justifycontent: space-between;
	margin-bottom: 4%;
`;

const ButtonsModalRowView = styled.View`
	display: flex;
	flexdirection: row;
	justifycontent: space-between;
	alignitems: center;
`;
const InModalButton = styled.TouchableOpacity`
	backgroundcolor: #d1d3d4;
	padding: 3%;
`;

export default ShowAllRideRequests;
