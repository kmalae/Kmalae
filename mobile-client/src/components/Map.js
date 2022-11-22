import { useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { useSelector } from "react-redux";
import {
	selectOrigin,
	selectDestination,
	selectVehicleID,
} from "../slices/RideLiftSlice";
import { StyleSheet, View } from "react-native";

export default function Map() {
	const origin = useSelector(selectOrigin);
	const destination = useSelector(selectDestination);
	const vehicleID = useSelector(selectVehicleID);
	const mapRef = useRef();

	useEffect(() => {
		if (!origin || !destination) return;
		mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
			edgePadding: { top: 119, right: 50, bottom: 50, left: 50 },
			animated: true,
		});
	}, [ origin, destination]);

	return (
		<MapView
			style={page.map}
			ref={mapRef}
			mapType="mutedStandard"
			initialRegion={{
				latitude: parseFloat(origin.location.lat),
				longitude: parseFloat(origin.location.lng),
				latitudeDelta: 0.005,
				longitudeDelta: 0.005,
			}}
		>
			{origin.location ? (
				<Marker
					coordinate={{
						latitude: parseFloat(origin.location.lat),
						longitude: parseFloat(origin.location.lng),
					}}
					title="Origin"
					description={origin.description}
					identifier="origin"
				/>
			) : null}

			{destination && destination.location ? (
				<Marker
					coordinate={{
						latitude: parseFloat(destination.location.lat),
						longitude: parseFloat(destination.location.lng),
					}}
					title="Destination"
					description={destination.description}
					identifier="destination"
				/>
			) : null}
		</MapView>
	);
}

const page = StyleSheet.create({
	map: {
		minHeight: "50%",
		width: "100%",
		margin: 0,
	},
});
