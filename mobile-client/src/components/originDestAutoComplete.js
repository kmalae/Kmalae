import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { setOrigin, setDestination } from "../slices/RideLiftSlice";
import { useDispatch } from "react-redux";
import { Input } from "react-native-elements";
import styled from "styled-components";

export default function OriginDestinationAutoComplete(props) {
	const dispatch = useDispatch();
	const showDestAlways = props.showDestAlways;
	// const [isShowingDestinationSearch, setIsShowingDestinationSearch] = useState(
	// 	showDestAlways ? true : false
	// );
	const [isShowingDestinationSearch, setIsShowingDestinationSearch] =
		useState(true);

	return (
		<GooglePlacesAutocompleteContainer>
			<GooglePlacesAutocomplete
				placeholder="Pick-up Location"
				nearbyPlacesAPI="GooglePlacesSearch"
				debounce={400}
				autoFocus={false}
				styles={styles.PickupPointInputStyle}
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
					placeholder="Drop-off Location"
					nearbyPlacesAPI="GooglePlacesSearch"
					debounce={400}
					styles={styles.DestinationInputStyle}
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
		</GooglePlacesAutocompleteContainer>
	);
}

const styles = StyleSheet.create({
	PickupPointInputStyle: {
		container: {
			width: "90%",
			position: "absolute",
			marginTop: "15%",
			zIndex: 1,
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
	DestinationInputStyle: {
		container: {
			width: "90%",
			position: "absolute",
			marginTop: "30%",
			zIndex: 1,
		},
		textinput: {
			fontSize: 18,
		},
	},
});

const GooglePlacesAutocompleteContainer = styled.View`
	width: 100%;
	height: 40%;
	z-index: 1;
	position: absolute;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
`;
