import { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { showMessage } from 'react-native-flash-message';
import { useSelector } from 'react-redux';
import {
	selectTimeOfDeparture,
	selectOrigin,
	selectDestination,
	selectVehicleID,
	selectAcceptableRadius,
} from '../slices/RideLiftSlice';
import {
	StyleSheet,
	View,
	Text,
	Dimensions,
	Animated,
	Platform,
	Alert,
} from 'react-native';
import axios from 'axios';
import config from '../../config';
import { formatDatePlus4, formatDateNetural } from '../services/FormatDateTime';
import MapViewDirections from 'react-native-maps-directions';
import styled from 'styled-components';

const { width } = Dimensions.get('window');
const CARD_HEIGHT = 195;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const ShowAllPotentialPassengers = () => {
	const origin = useSelector(selectOrigin);
	const destination = useSelector(selectDestination);
	const timeOfDeparture = useSelector(selectTimeOfDeparture);
	const vehicleID = useSelector(selectVehicleID);
	const radius = useSelector(selectAcceptableRadius);

	const [mutualServerData, setMutualServerData] = useState([]);
	const [matchRideServerData, setMachRideServerData] = useState([]);
	const [showDirections, setShowDirections] = useState(false);
	const [onFoucsRider, setOnFoucsRider] = useState({});
	const [allPointsDirectionVisiblity, setAllPointsDirectionVisibility] =
		useState(false);
	const [wayPointsState, setWayPointsState] = useState([]);

	let requestedMatches = 0;
	let requesedMatchesRideID = [];

	const _map = useRef(null);
	const _scrollView = useRef(null);

	let mapIndex = 0;
	let mapAnimation = new Animated.Value(0);

	const RequestRiderAlertMessage = (
		pickUp,
		dest,
		passengerID,
		rideID,
		timeOfDeparture
	) =>
		Alert.alert('Are you sure?', 'You are about to request a rider!', [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'OK',
				onPress: () => {
					handleRiderRequest(
						pickUp,
						dest,
						passengerID,
						rideID,
						timeOfDeparture
					);
				},
			},
		]);

	const DeleteRiderAlertMessage = (matchIndexInServerData) =>
		Alert.alert('Are you sure?', 'You are about to delete a rider request!', [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'OK',
				onPress: () => {
					handleRiderRequestDelete(matchIndexInServerData);
				},
			},
		]);

	const DriverCantCancelAlert = (error) =>
		Alert.alert('Warning', `${error}`, [
			{
				text: 'Ok',
				style: 'cancel',
			},
		]);

	const FareEstInfoMessage = (time, money) =>
		Alert.alert(
			'Fare Est.',
			`Trip Fare: ${money} AED.
Trip duration: ${time}`,
			[
				{
					text: 'Ok',
					style: 'cancel',
				},
			]
		);

	const RequestMaxReachedAlert = () =>
		Alert.alert(
			'Warning',
			'You have already requested 4 riders, delete to request new',
			[
				{
					text: 'Ok',
					style: 'cancel',
				},
			]
		);

	const getTravelTime = async (pickUp, dest) => {
		const origins = parseFloat(pickUp.lat) + ',' + parseFloat(pickUp.lng);
		const destinations = parseFloat(dest.lat) + ',' + parseFloat(dest.lng);
		const timeResult = await axios(
			`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origins}&destinations=${destinations}&key=${config.GOOGLE_MAPS_APIKEY}`
		).then((data) => {
			const result = data.data.rows[0].elements[0].duration;
			return result;
		});
		return timeResult;
	};

	function ShowMapDirectons(riderPickUpPoint) {
		return (
			<MapViewDirections
				origin={{
					latitude: parseFloat(origin.location.lat),
					longitude: parseFloat(origin.location.lng),
				}}
				destination={{
					latitude: parseFloat(riderPickUpPoint.riderPickUpPoint.lat),
					longitude: parseFloat(riderPickUpPoint.riderPickUpPoint.lng),
				}}
				apikey={config.GOOGLE_MAPS_APIKEY}
				strokeWidth={5}
				strokeColor="#1c86ff"
			/>
		);
	}

	function AllPointsMapDirectons() {
		let wayPoints = [];
		requesedMatchesRideID.map((ride) => {
			wayPoints.push({
				latitude: parseFloat(ride.pickUpPoint.lat),
				longitude: parseFloat(ride.pickUpPoint.lng),
			});
		});

		requesedMatchesRideID.map((ride) => {
			wayPoints.push({
				latitude: parseFloat(ride.destination.lat),
				longitude: parseFloat(ride.destination.lng),
			});
		});

		setWayPointsState(wayPoints);
	}

	const handleRiderRequest = async (
		pickUp,
		dest,
		passengerID,
		rideID,
		timeOfDeparture
	) => {
		const time = await getTravelTime(pickUp, dest);
		const tripFare = (time.value / 120).toFixed(2);

		await axios
			.post(`${config.KMALAE_DOMAIN}/api/match/createMatchRequest`, {
				passengerID: passengerID,
				vehicleID: vehicleID,
				rideRequestID: rideID,
				destination: {
					lat: dest.lat,
					lng: dest.lng,
					description: dest.description,
				},
				timeOfDeparture: timeOfDeparture,
				amountPaid: parseFloat(tripFare),
			})
			.then(async () => {
				await axios
					.post(`${config.KMALAE_DOMAIN}/api/match/getMatchRequests`, {
						stance: 'driver',
					})
					.then((res) => {
						setMachRideServerData(res.data);
					})
					.catch((error) => console.log(error.response.data.errors));

				showMessage({
					message: 'Rider Requested Successfully',
					type: 'success',
				});
			})
			.catch((error) =>
				console.log('Axios - Request MatchRide: ', error.response.data.errors)
			);
	};

	const handleRiderRequestDelete = async (matchIndexInServerData) => {
		const matchID = matchRideServerData[matchIndexInServerData].id;
		console.log({ matchID });
		console.log({ Match: matchRideServerData[matchIndexInServerData] });
		await axios
			.delete(`${config.KMALAE_DOMAIN}/api/match/cancelMatchRequest`, {
				data: { matchRequestID: matchID },
			})
			.then(async () => {
				await axios
					.post(`${config.KMALAE_DOMAIN}/api/match/getMatchRequests`, {
						stance: 'driver',
					})
					.then((res) => {
						setMachRideServerData(res.data);
					})
					.catch((error) => console.log(error.response.data.errors));

				showMessage({
					message: 'Rider Requested Successfully',
					type: 'success',
				});
			})
			.catch((error) => {
				const mainError = error.response.data.errors 
				if (mainError[0].message !== null) DriverCantCancelAlert(mainError[0].message);
				console.log(mainError);
			});
	};

	const FareEST = async (pickUp, dest) => {
		const time = await getTravelTime(pickUp, dest);
		const tripDuration = time.text;
		const tripFare = (time.value / 120).toFixed(2);
		FareEstInfoMessage(tripDuration, tripFare);
	};

	const checkForRequestedMatch = (rideIDFromMutual) =>
		matchRideServerData.findIndex((e) => e.ride === rideIDFromMutual);

	const interpolations = mutualServerData.map((marker, index) => {
		const inputRange = [
			(index - 1) * CARD_WIDTH,
			index * CARD_WIDTH,
			(index + 1) * CARD_WIDTH,
		];

		const scale = mapAnimation.interpolate({
			inputRange,
			outputRange: [1, 1.5, 1],
			extrapolate: 'clamp',
		});

		return { scale };
	});

	const onMarkerPress = (mapEventData) => {
		const markerID = mapEventData._targetInst.return.key;

		let x = markerID * CARD_WIDTH + markerID * 20;
		if (Platform.OS === 'ios') {
			x = x - SPACING_FOR_CARD_INSET;
		}

		_scrollView.current.scrollTo({ x: x, y: 0, animated: true });
	};

	useEffect(() => {
		axios
			.post(`${config.KMALAE_DOMAIN}/api/match/getMatchRequests`, {
				stance: 'driver',
			})
			.then((res) => {
				setMachRideServerData(res.data);
			})
			.catch((error) => console.log(error.response.data.errors));

		axios
			.post(`${config.KMALAE_DOMAIN}/api/recomm/getMutualRequests`, {
				destination: {
					lat: destination.location.lat,
					lng: destination.location.lng,
					description: destination.description,
				},
				timeOfDeparture: formatDateNetural(timeOfDeparture),
				acceptableRadius: radius,
			})
			.then((res) => {
				setMutualServerData(res.data);
			})
			.catch((error) => console.log(error.response.data.errors));
	}, []);

	useEffect(() => {}, [matchRideServerData]);

	useEffect(() => {
		mapAnimation.addListener(({ value }) => {
			let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
			if (index >= mutualServerData.length) {
				index = mutualServerData.length - 1;
			}
			if (index <= 0) {
				index = 0;
			}

			clearTimeout(regionTimeout);

			const regionTimeout = setTimeout(() => {
				if (mapIndex !== index) {
					mapIndex = index;
					const { pickUpPoint } = mutualServerData[index];
					_map.current.animateToRegion(
						{
							latitude: parseFloat(pickUpPoint.lat),
							longitude: parseFloat(pickUpPoint.lng),
							latitudeDelta: 0.09864195044303443,
							longitudeDelta: 0.090142817690068,
						},
						350
					);
				}
			}, 10);
		});
	});

	return (
		<View style={styles.container}>
			<MapView
				ref={_map}
				initialRegion={{
					latitude: 24.676956,
					longitude: 54.7342432,
					latitudeDelta: 0.105,
					longitudeDelta: 0.105,
				}}
				style={styles.container}
			>
				<Marker
					coordinate={{
						latitude: parseFloat(origin.location.lat),
						longitude: parseFloat(origin.location.lng),
					}}
					title={'You Are Here'}
					pinColor={'green'}
					identifier={'origin'}
				></Marker>

				{allPointsDirectionVisiblity && (
					<MapViewDirections
						origin={{
							latitude: parseFloat(origin.location.lat),
							longitude: parseFloat(origin.location.lng),
						}}
						destination={{
							latitude: parseFloat(destination.location.lat),
							longitude: parseFloat(destination.location.lng),
						}}
						apikey={config.GOOGLE_MAPS_APIKEY}
						strokeWidth={5}
						strokeColor="#1c86ff"
						waypoints={wayPointsState}
					/>
				)}

				{showDirections && <ShowMapDirectons riderPickUpPoint={onFoucsRider} />}

				{mutualServerData.map((ride, index) => {
					const scaleStyle = {
						transform: [
							{
								scale: interpolations[index].scale,
							},
						],
					};
					return (
						<View>
							<Marker
								key={index}
								coordinate={{
									latitude: parseFloat(ride.pickUpPoint.lat),
									longitude: parseFloat(ride.pickUpPoint.lng),
								}}
								identifier={'destination'}
								onPress={(e) => onMarkerPress(e)}
							>
								<Animated.View style={[styles.markerWrap]}>
									<Animated.Image
										source={require('../..//assets/images/map_marker.png')}
										style={[styles.marker, scaleStyle]}
										resizeMode="cover"
									/>
								</Animated.View>
							</Marker>
							<Marker
								key={ride.id}
								coordinate={{
									latitude: parseFloat(ride.destination.lat),
									longitude: parseFloat(ride.destination.lng),
								}}
								pinColor={'blue'}
							></Marker>
						</View>
					);
				})}
			</MapView>

			<TripButton
				// style={{ bottom: '89%', left: '34%' }}
				onPress={() => {
					AllPointsMapDirectons();
					setAllPointsDirectionVisibility(!allPointsDirectionVisiblity);
				}}
			>
				<Text>Trip</Text>
			</TripButton>

			<Animated.ScrollView
				ref={_scrollView}
				horizontal
				pagingEnabled
				scrollEventThrottle={1}
				showsHorizontalScrollIndicator={false}
				snapToInterval={CARD_WIDTH + 20}
				snapToAlignment="center"
				style={styles.scrollView}
				contentInset={{
					top: 0,
					left: SPACING_FOR_CARD_INSET,
					bottom: 0,
					right: SPACING_FOR_CARD_INSET,
				}}
				contentContainerStyle={{
					paddingHorizontal:
						Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0,
				}}
				onScroll={Animated.event(
					[
						{
							nativeEvent: {
								contentOffset: {
									x: mapAnimation,
								},
							},
						},
					],
					{ useNativeDriver: true }
					// {listener: (event) => handleScroll(event)}
				)}
			>
				{mutualServerData.map((ride, index) => {
					const isMatchRequested = checkForRequestedMatch(ride.id);
					if (
						isMatchRequested != -1 &&
						matchRideServerData[isMatchRequested].status !== 'cancelled'
					) {
						requestedMatches++;
						requesedMatchesRideID.push(ride);
					}
					return (
						<View style={styles.card} key={index}>
							<RowCardList>
								<Text>Leaving at:</Text>
								<Text>{formatDatePlus4(ride.timeOfDeparture)}</Text>
							</RowCardList>
							<RowCardList>
								<Text>From:</Text>
								<Text>
									{ride.pickUpPoint.description.substring(0, 26) + '...'}
								</Text>
							</RowCardList>
							<RowCardList>
								<Text>To:</Text>
								<Text>
									{ride.destination.description.substring(0, 27) + '...'}
								</Text>
							</RowCardList>

							<RowCardList>
								<InCardButton
									onPress={() => {
										setShowDirections(!showDirections);
										setOnFoucsRider(ride.pickUpPoint);
									}}
								>
									<Text>Show Directions</Text>
								</InCardButton>

								<InCardButton
									onPress={() => {
										FareEST(ride.pickUpPoint, ride.destination);
									}}
								>
									<Text>Fare Est.</Text>
								</InCardButton>
							</RowCardList>

							<RowCardList>
								{isMatchRequested == -1 ? (
									<InCardButton
										onPress={() => {
											requestedMatches < 4
												? RequestRiderAlertMessage(
														ride.pickUpPoint,
														ride.destination,
														ride.user,
														ride.id,
														formatDateNetural(ride.timeOfDeparture)
												  )
												: RequestMaxReachedAlert();
										}}
									>
										<Text>Request Rider</Text>
									</InCardButton>
								) : (
									<Text style={{ padding: '6%' }}>
										{matchRideServerData[isMatchRequested].status}
									</Text>
								)}

								{isMatchRequested !== -1 && (
									<InCardButton
										onPress={() => {
											DeleteRiderAlertMessage(isMatchRequested);
										}}
									>
										<Text>Delete</Text>
									</InCardButton>
								)}
							</RowCardList>
						</View>
					);
				})}
			</Animated.ScrollView>
		</View>
	);
};

const RowCardList = styled.View`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-bottom: 2px;
`;

const InCardButton = styled.TouchableOpacity`
	margin: 15px auto 0 auto;
	background-color: #d1d3d4;
	padding: 3% 7%;
	border-radius: 10px;
`;

const TripButton = styled.TouchableOpacity`
	${'' /* margin: 15px auto 0 auto; */}
	background-color: #d1d3d4;
	padding: 3px 7px;
	border-radius: 10px;
	margin-top: 12%;
	margin-left: 80%;
	display: flex;
	flex-direction: row;
	justify-content: center;

	${'' /* bottom: 89%; */}
	position: absolute;
	${'' /* left: 34%; */}
`;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	markerWrap: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 50,
		height: 50,
	},
	marker: {
		width: 30,
		height: 30,
	},
	scrollView: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		paddingVertical: 10,
	},
	card: {
		padding: 10,
		elevation: 2,
		backgroundColor: '#FFF',
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		marginHorizontal: 10,
		shadowColor: '#000',
		shadowRadius: 5,
		shadowOpacity: 0.3,
		shadowOffset: { x: 2, y: -2 },
		height: CARD_HEIGHT,
		width: CARD_WIDTH,
		overflow: 'hidden',
	},
});

export default ShowAllPotentialPassengers;
