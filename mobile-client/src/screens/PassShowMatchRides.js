import { SafeAreaView, Text, Modal, View, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import axios from 'axios';
import config from '../../config';
import { showMessage } from 'react-native-flash-message';
import { useDispatch, useSelector } from 'react-redux';
import {
	setDestination,
	setOrigin,
	setRideLiftID,
	setTimeOfDeparture,
	selectRideLiftID,
} from '../slices/RideLiftSlice';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import {formatDateNetural, formatDatePlus4} from '../services/FormatDateTime';

const PassShowMatchRides = () => {
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const isFocused = useIsFocused();

	const rideID = useSelector(selectRideLiftID);

	const [rideDetailsModalVisible, setRideDetailsModalVisibility] =
		useState(false);
	const [serverData, setServerData] = useState([]);
	const [itemDetails, setItemDetails] = useState();

	const filterSpecificMatchRides = (matches) => {
		let matchesToshow = [];
		matches.findIndex((e) => {
			if (e.ride === rideID) matchesToshow.push(e);
		});
		setServerData(matchesToshow);
	};

	const AcceptAlertMessage = (matchRideID) =>
		Alert.alert('Are you sure?', 'You are about to accept a lift!', [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'OK',
				onPress: () => {
					axios
						.post(`${config.KMALAE_DOMAIN}/api/match/confirmMatchRequest`, {
							
								matchRequestID: matchRideID,
						
						})
						.then(() => {
							showMessage({
								message: 'Ride Confirmed Successfully',
								type: 'success',
							});
							axios
								.post(`${config.KMALAE_DOMAIN}/api/match/getMatchRequests`, {
									stance: 'passenger',
								})
								.then((res) => {
									filterSpecificMatchRides(res.data);
								})
								.catch((error) =>
									console.log('Axios - Get MatchRides: ', error.response.data.errors)
								);
						})
						.catch((error) =>
							console.log('Axios - Accept Matchride: ', error.response.data.errors)
						);
					setRideDetailsModalVisibility(false);
				},
			},
		]);

	const CancelAlertMessage = (matchID) =>
		Alert.alert('Are you sure?', 'You are about to cancel a confirmed request!', [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'OK',
				onPress: () => {
					axios
						.delete(`${config.KMALAE_DOMAIN}/api/match/passengerCancelRequest`, {
							data: {
								matchRequestID: matchID,
								passengerCurrentTime: formatDateNetural(new Date())
							}
						})
						.then(() => {
							showMessage({
								message: 'Confirmation Cancelled Successfully',
								type: 'success',
							});
							axios
								.post(`${config.KMALAE_DOMAIN}/api/match/getMatchRequests`, {
									stance: 'passenger',
								})
								.then((res) => {
									filterSpecificMatchRides(res.data);
								})
								.catch((error) =>
									console.log('Axios - Get MatchRides: ', error.response.data.errors)
								);
						})
						.catch((error) => {
							const mainError = error.response.data.errors 
							if (mainError[0].message !== null) PassengerCantCancelAlert(mainError[0].message);
							console.log('Axios - Cancel MatchRide: ', mainError);
						});
					setRideDetailsModalVisibility(false);
				},
			},
		]);

		const PassengerCantCancelAlert = (error) =>
		Alert.alert('Warning', `${error}`, [
			{
				text: 'Ok',
				style: 'cancel',
			},
		]);

	useEffect(() => {
		axios
			.post(`${config.KMALAE_DOMAIN}/api/match/getMatchRequests`, {
				stance: 'passenger',
			})
			.then((res) => {
				filterSpecificMatchRides(res.data);
			})
			.catch((error) => console.log(error.response.data.errors));
	}, [isFocused]);

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
						}}
					>
						<RideModalView>
							<ModalRowView>
								<Text>Trip Fare: </Text>
								<Text>{item.amountPaid} AED</Text>
							</ModalRowView>
							<ModalRowView>
								<Text>Pick up at: </Text>
								<Text>{formatDatePlus4(item.timeOfDeparture)}</Text>
							</ModalRowView>
							<ModalRowView>
								<Text>Status: </Text>
								<Text>
									{item.status === 'requested'
										? 'Waiting Your Confirmation'
										: item.status}
								</Text>
							</ModalRowView>

							<ButtonsModalRowView>
								<InModalButton
									onPress={() => {
										onClose();
									}}
								>
									<Text>Close</Text>
								</InModalButton>

								{(item.status === 'requested') && <InModalButton
									onPress={() => {
										AcceptAlertMessage(item.id);
									}}
								>
									<Text>Accept</Text>
								</InModalButton>}

								{(item.status === 'confirmed') && <InModalButton
									onPress={() => {
										CancelAlertMessage(item.id);
									}}
								>
									<Text>Reject</Text>
								</InModalButton>}
							</ButtonsModalRowView>
						</RideModalView>
					</Modal>
				)}
			</View>
		);
	}


	return (
		<SafeAreaView>
			<HeaderText>All Pick up Requests</HeaderText>
			<RideRequestsScrollView>
				<RidesFlatList
					data={serverData}
					keyExtractor={(item) => item.id}
					ListEmptyComponent={
						<Text
							style={{
								marginLeft: 'auto',
								marginRight: 'auto',
								marginTop: '50%',
							}}
						>
							No pick up requests to show
						</Text>
					}
					renderItem={({ item: { timeOfDeparture, status }, item }) => (
						<RideTouchOpacity
							onPress={() => {
								setRideDetailsModalVisibility(true);
								setItemDetails(item);
							}}
						>
							<Text>{formatDatePlus4(timeOfDeparture)}</Text>
							<Text>{status === 'requested' ? 'Action Needed!' : status}</Text>
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
	${'' /* border: 2px solid red; */}
	margin: 0 auto;
`;

const RideTouchOpacity = styled.TouchableOpacity`
	display: flex;
	background-color: #d1d3d4;
	padding: 2.5%;
	width: 90%;
	height: 41px;
	border-radius: 5px;
	margin: 0 auto 3% auto;
	border: 2px solid yellow;
	flex-direction: row;
	justify-content: space-between;
`;

const RideRequestsScrollView = styled.View`
	height: 75%;
`;

const RideModalView = styled.View`
	background-color: white;
	border: 2px solid black;
	border-radius: 4px;
	margin: 50% auto 0 auto;
	padding: 5%;
	width: 90%;
`;
const ModalRowView = styled.View`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-bottom: 4%;
`;

const ButtonsModalRowView = styled.View`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;
const InModalButton = styled.TouchableOpacity`
	background-color: #d1d3d4;
	padding: 3%;
`;

export default PassShowMatchRides;
