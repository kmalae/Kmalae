import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	TextInput,
} from "react-native";
import React, { useState } from "react";
import Map from "../components/Map";
import OriginDestinationAutoComplete from "../components/originDestAutoComplete";
import { useSelector, useDispatch } from "react-redux";
import {
	selectDestination,
	selectOrigin,
	selectRideLiftID,
	selectTimeOfDeparture,
	setTimeOfDeparture,
	selectVehicleID,
} from "../slices/RideLiftSlice";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styled from "styled-components/native";
import config from "../../config";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import ShowAllLiftRequests from "./ShowAllLiftRequests";
import {formatDatePlus4, formatDateNetural} from "../services/FormatDateTime";

const GiveRide = ({ route }) => {
	const navigation = useNavigation();

	const origin = useSelector(selectOrigin);
	const destination = useSelector(selectDestination);
	const timeOfDeparture = useSelector(selectTimeOfDeparture);
	const rideLiftID = useSelector(selectRideLiftID);
	const vehicleID = useSelector(selectVehicleID);

	const dispatch = useDispatch();

	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

	const isUpdating = route.params.isUpdating;

	const handleMakeLiftRequestOrUpdate = () => {
		if (isUpdating) {
			updateRequest();
		} else {
			saveLift();
		}
	};

	const saveLift = () => {
		const formatedDateTime = formatDateNetural(timeOfDeparture);

		axios
			.post(`${config.KMALAE_DOMAIN}/api/recomm/createLiftRequest`, {
				vehicleID: vehicleID,
				currentLocation: {
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
			.then()
			.catch((error) => console.log(error.response.data.errors));
		showMessage({
			message: "Lift request created successufully",
			type: "success",
		});
	};

	const updateRequest = () => {
		const formatedDateTime = formatDateNetural(timeOfDeparture);

		axios
			.post(`${config.KMALAE_DOMAIN}/api/recomm/updateLiftRequest`, {
				liftRequestID: rideLiftID,
				vehicleID: vehicleID,
				currentLocation: {
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
			.then(() => navigation.navigate(ShowAllLiftRequests))
			.catch((error) => console.log(error.response.data.errors));
		console.log(
			"All datas >>>>>>>>>>>>>",
			rideLiftID,
			vehicleID,
			origin,
			destination,
			formatedDateTime
		);
		showMessage({
			message: "Lift request has updated successufully",
			type: "success",
		});
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
		<View>
			<OriginDestinationAutoComplete showDestAlways={isUpdating} />

			<Map />

			<View style={styles.timeOfDepartureContainer}>
				<View style={{ marginLeft: "auto", marginRight: "auto" }}>
					<Text style={styles.textQuestion}>When are you going?</Text>
					<View style={styles.dateTimeInputContainer}>
						<TextInput
							style={styles.dateTextInput}
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
					style={styles.calanderButton}
					onPress={showDatePicker}
					// disabled = {!destination}
				>
					<Ionicons size={34} name="calendar-outline" />
				</TouchableOpacity>
			</View>

			{isDatePickerVisible && (
				<DateTimePickerModal
					isVisible={isDatePickerVisible}
					style={{
						width: "100%",
						height: "65%",
						borderColor: "red",
						borderWidth: 2,
						top: "30%",
					}}
					// display = 'default'
					mode="datetime"
					minimumDate={new Date()}
					onConfirm={handleConfirm}
					onCancel={hideDatePicker}
					locale="en-AE"
				/>
			)}

			<OptionsTouchOpacity
				disabled={!destination}
				onPress={() => {
					handleMakeLiftRequestOrUpdate();
					navigation.navigate(ShowAllLiftRequests);
				}}>
				<Text style={{ marginLeft: "auto", marginRight: "auto" }}>
					{isUpdating ? "Update Request" : "Save Request"}
				</Text>
			</OptionsTouchOpacity>
		</View>
	);
};

const OptionsTouchOpacity = styled.TouchableOpacity`
	background-color: #d1d3d4;
	padding: 3.5%;
	width: 40%;
	border-radius: 5px;
	display: flex;
	justifycontent: center;
	margin: 15% auto 0 auto;
`;

const styles = StyleSheet.create({
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

export default GiveRide;
