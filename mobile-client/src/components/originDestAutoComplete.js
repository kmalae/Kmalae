import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { setOrigin, setDestination } from "../slices/RideLiftSlice";
import { useDispatch } from "react-redux";
import { Input } from "react-native-elements";

export default function OriginDestinationAutoComplete(props) {
	const dispatch = useDispatch();
	const showDestAlways = props.showDestAlways;
	const [isShowingDestinationSearch, setIsShowingDestinationSearch] = useState(
		showDestAlways ? true : false
	);

	return (
		<View style={{ zIndex: 10 }}>
			<GooglePlacesAutocomplete
				placeholder="Pick-up place"
				nearbyPlacesAPI="GooglePlacesSearch"
				debounce={400}
				autoFocus={false}
				styles={styles.originSearch}
				textInputProps={{
					onChangeText: (text) => {
						text ? setIsShowingDestinationSearch(false) : 1;
					},
					InputComp: Input,
					rightIcon: { type: "Ion-icons", name: "search" },
					errorStyle: { color: "red" },
					rightIconContainerStyle: {
						zIndex: 1000,
						position: "absolute",
						right: "0%",
					},
				}}
				onPress={(data, details) => {
					dispatch(
						setOrigin({
							location: details.geometry.location,
							description: data.description,
						})
					);
					setIsShowingDestinationSearch(!isShowingDestinationSearch);
				}}
				fetchDetails={true}
				returnKeyType={"search"}
				enablePoweredByContainer={false}
				minLength={2}
				query={{
					key: GOOGLE_MAPS_APIKEY,
					language: "en",
				}}
			/>

			{isShowingDestinationSearch && (
				<GooglePlacesAutocomplete
					placeholder="Drop-off Place"
					nearbyPlacesAPI="GooglePlacesSearch"
					debounce={400}
					styles={styles.destinationSearch}
					onPress={(data, details) => {
						dispatch(
							setDestination({
								location: details.geometry.location,
								description: data.description,
							})
						);
					}}
					fetchDetails={true}
					returnKeyType={"search"}
					enablePoweredByContainer={false}
					minLength={2}
					query={{
						key: GOOGLE_MAPS_APIKEY,
						language: "en",
					}}
					textInputProps={{
						InputComp: Input,
						rightIcon: { type: "Ion-icons", name: "search" },
						errorStyle: { color: "red" },
						rightIconContainerStyle: {
							zIndex: 1000,
							position: "absolute",
							right: "0%",
						},
					}}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	originSearch: {
		container: {
			flex: 0,
			top: 41,
			zIndex: 999,
			width: "90%",
			height: 300,
			left: "5%",
			right: "5%",
			position: "absolute",
		},

		originSearchNotFocus: {
			opacity: 0.1,
		},

		originSearchOnFoucs: {
			opacity: 1,
		},

		textinput: {
			fontSize: 18,
		},
	},

	destinationSearch: {
		container: {
			flex: 0,
			top: 91,
			zIndex: 999,
			width: "90%",
			height: 300,
			left: "5%",
			right: "5%",
			position: "absolute",
		},
		textinput: {
			fontSize: 18,
		},
	},
});
