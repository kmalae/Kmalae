import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	TextInput,
	ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";
import Map from "../components/Map";
import OriginDestinationAutoComplete from "../components/originDestAutoComplete";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styled from "styled-components/native";
import config from "../../config";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import { formatDatePlus4, formatDateNetural } from "../services/FormatDateTime";

import ShowAllRideRequests from "./ShowAllRideRequests";

import {
	selectTransitionDelay,
	setTransitionDelay,
} from "../slices/CommonSlice";

import {
	selectDestination,
	selectOrigin,
	selectRideLiftID,
	selectTimeOfDeparture,
	setTimeOfDeparture,
} from "../slices/RideLiftSlice";

const RideRequestScreen = ({ route }) => {
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const transitionDelay = useSelector(selectTransitionDelay);
	const isUpdating = route.params.isUpdating;
	const origin = useSelector(selectOrigin);
	const destination = useSelector(selectDestination);
	const timeOfDeparture = useSelector(selectTimeOfDeparture);
	const rideLiftID = useSelector(selectRideLiftID);
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			dispatch(setTransitionDelay(false));
		}, 500);
		return () => clearTimeout(timer);
	}, []);

	const handleMakeOrUpdateRequest = () => {
		if (isUpdating) {
			updateRequest();
		} else {
			makeRequest();
		}
	};

	const makeRequest = () => {
		const formatedDateTime = formatDateNetural(timeOfDeparture);

		axios
			.post(`${config.KMALAE_DOMAIN}/api/rides/createRideRequest`, {
				pickUpPoint: {
					lat: origin.location.lat.toString(),
					lng: origin.location.lng.toString(),
					description: origin.description
				},
				destination: {
					lat: destination.location.lat.toString(),
					lng: destination.location.lng.toString(),
					description: destination.description,
				},
				timeOfDeparture: formatedDateTime,
			})
			.then(() => navigation.navigate(ShowAllRideRequests))
			.catch((error) => console.log(error.response.data.errors));
		showMessage({
			message: "Ride request created successufully",
			type: "success",
		});
	};

	const updateRequest = () => {
		const formatedDateTime = formatDateNetural(timeOfDeparture);

		axios
			.post(`${config.KMALAE_DOMAIN}/api/rides/updateRideRequest`, {
				rideRequestID: rideLiftID,
				pickUpPoint: {
					lat: origin.location.lat.toString(),
					lng: origin.location.lng.toString(),
					description: origin.description
				},
				destination: {
					lat: destination.location.lat.toString(),
					lng: destination.location.lng.toString(),
					description: destination.description
				},
				timeOfDeparture: formatedDateTime,
			})
			.then(() => {
				navigation.navigate(ShowAllRideRequests);
				showMessage({
					message: 'Ride request has updated successufully',
					type: 'success',
				});
			})
			.catch((error) => console.log(error.response.data.errors));
	};

	const showDatePicker = () => {
		setDatePickerVisibility(true);
	};
	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};
	const handleConfirm = (datetime) => {
		dispatch(setTimeOfDeparture(datetime));
		setDatePickerVisibility(false);
	};

	return (
		<View style={styles.outerContainer}>
			<ImageBackground
				source={require("../../assets/images/kmalae-bg-2.jpg")}
				style={styles.backgroundImage}
			></ImageBackground>
			<View style={styles.fader}></View>
			<View style={styles.container}>
				<Map />

				<OriginDestinationAutoComplete showDestAlways={isUpdating} />

				<View style={styless.timeOfDepartureContainer}>
					<View style={{ marginLeft: "auto", marginRight: "auto" }}>
						<Text style={styless.textQuestion}>When are you going?</Text>
						<View style={styless.dateTimeInputContainer}>
							<TextInput
								style={styless.dateTextInput}
								value={
									timeOfDeparture === null
										? formatDatePlus4(new Date())
									: formatDatePlus4(timeOfDeparture)
								}
								placeholder="Select Date"
							/>
						</View>
					</View>

					<TouchableOpacity
						style={styless.calanderButton}
						onPress={showDatePicker}
						// disabled = {!destination}
					>
						<Ionicons size={34} name="calendar-outline" />
					</TouchableOpacity>
				</View>

				{isDatePickerVisible && (
					<DateTimePickerModal
						isVisible={isDatePickerVisible}
						mode="datetime"
						minimumDate={new Date(new Date().getTime() + 4 * 60 * 60 * 1000)}
						onConfirm={handleConfirm}
						onCancel={hideDatePicker}
						locale="en-AE"
					/>
				)}

				<OptionsTouchOpacity
					disabled={!destination}
					onPress={() => {
						handleMakeOrUpdateRequest();
						navigation.navigate(ShowAllRideRequests);
					}}
				>
					<Text style={{ marginLeft: "auto", marginRight: "auto" }}>
						{isUpdating ? "Save update" : "Make a request"}
					</Text>
				</OptionsTouchOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	outerContainer: {
		width: "100%",
		height: "100%",
		position: "relative",
	},
	backgroundImage: {
		height: "100%",
		width: "100%",
		position: "absolute",
		top: 0,
		left: 0,
		zIndex: 0,
	},
	fader: {
		height: "100%",
		width: "100%",
		position: "absolute",
		top: 0,
		left: 0,
		zIndex: 1,
		backgroundColor: "black",
		opacity: 0.7,
	},
	container: {
		flex: 1,
		zIndex: 3,
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "center",
	},
});

export default RideRequestScreen;

const OptionsTouchOpacity = styled.TouchableOpacity`
	background-color: #d1d3d4;
	padding: 3.5%;
	width: 40%;
	border-radius: 5px;
	display: flex;
	justify-content: center;
	margin: 15% auto 0 auto;
`;

const styless = StyleSheet.create({
	requestButton: {
		backgroundColor: "green",
		width: 190,
		marginLeft: 90,
		display: "flex",
		flexDirection: "row",
		top: 30,
		padding: 10,
		borderRadius: 10,
	},

	requestButtonIcon: {
		marginLeft: 10,
	},

	timeOfDepartureContainer: {
		display: "flex",
		flexDirection: "row",
		width: "70%",
		marginLeft: "auto",
		marginRight: "auto",
		padding: 0,
		borderRadius: 10,
		top: 30,
	},

	calanderButton: {
		top: 22,
		left: 10,
	},

	dateTimeInputContainer: {
		display: "flex",
		flexDirection: "row",
		width: 200,
		borderWidth: 1.5,
		height: 40,
		// padding: 10,
	},
	dateTextInput: {
		left: 10,
		top: 3,
	},
	timeTextInput: {
		top: 3,
		left: 24,
	},
	textQuestion: {
		left: 10,
		top: 9,
		backgroundColor: "#f5f4f0",
		width: "78%",
		zIndex: 1,
		paddingLeft: 5,
		borderRadius: 10,
	},
});
