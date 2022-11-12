import { useEffect, useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { useSelector } from "react-redux";
import {
	selectTimeOfDeparture,
	selectOrigin,
	selectDestination,
	selectAcceptableRadius,
} from "../slices/RideLiftSlice";
import {
	StyleSheet,
	View,
	Text,
	Dimensions,
	Animated,
	Platform,
} from "react-native";
import axios from "axios";
import config from "../../config";
import formatDate from "../services/FormatDateTime";
import MapViewDirections from "react-native-maps-directions";

const { width } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const ShowAllPotentialPassengers = () => {
	const origin = useSelector(selectOrigin);
	const destination = useSelector(selectDestination);
	const timeOfDeparture = useSelector(selectTimeOfDeparture);
	const radius = useSelector(selectAcceptableRadius);

	const [serverData, setServerData] = useState([]);
	const _map = useRef(null);
	const _scrollView = useRef(null);

	let mapIndex = 0;
	let mapAnimation = new Animated.Value(0);

	const interpolations = serverData.map((marker, index) => {
		const inputRange = [
			(index - 1) * CARD_WIDTH,
			index * CARD_WIDTH,
			(index + 1) * CARD_WIDTH,
		];

		const scale = mapAnimation.interpolate({
			inputRange,
			outputRange: [1, 1.5, 1],
			extrapolate: "clamp",
		});

		return { scale };
	});

	const onMarkerPress = (mapEventData) => {
		// console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>",mapEventData.nativeEvent)
		console.log("%%%%%%%%%%%%%", interpolations);
		const markerID = mapEventData._targetInst.return.key;

		let x = markerID * CARD_WIDTH + markerID * 20;
		if (Platform.OS === "ios") {
			x = x - SPACING_FOR_CARD_INSET;
		}

		_scrollView.current.scrollTo({ x: x, y: 0, animated: true });
	};

	useEffect(() => {
		axios
			.post(`${config.KMALAE_DOMAIN}/api/recomm/getMutualRequests`, {
				destination: {
					lat: destination.location.lat,
					lng: destination.location.lng,
				},
				timeOfDeparture: formatDate(timeOfDeparture),
				acceptableRadius: radius,
			})
			.then((res) => {
				setServerData(res.data);
			});
	}, []);

	useEffect(() => {
		console.log("######################", mapAnimation);
		mapAnimation.addListener(({ value }) => {
			let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
			if (index >= serverData.length) {
				index = serverData.length - 1;
			}
			if (index <= 0) {
				index = 0;
			}

			clearTimeout(regionTimeout);

			const regionTimeout = setTimeout(() => {
				if (mapIndex !== index) {
					mapIndex = index;
					const { pickUpPoint } = serverData[index];
					_map.current.animateToRegion(
						{
							latitude: parseFloat(pickUpPoint.lat),
							longitude: parseFloat(pickUpPoint.lng),
							latitudeDelta: 0.04864195044303443,
							longitudeDelta: 0.040142817690068,
						},
						350
					);
				}
			}, 10);
		});
	});

	console.log(serverData);

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
				style={styles.container}>
				<MapViewDirections
					origin={{
						latitude: parseFloat(origin.location.lat),
						longitude: parseFloat(origin.location.lng),
					}}
					destination={{
						latitude: 24.3982887,
						longitude: 54.5602069,
					}}
					apikey={config.GOOGLE_MAPS_APIKEY}
					strokeWidth={5}
					strokeColor="#1c86ff"
				/>

				<Marker
					coordinate={{
						latitude: parseFloat(origin.location.lat),
						longitude: parseFloat(origin.location.lng),
					}}
					title={"You Are Here"}
					pinColor={"green"}></Marker>
				{serverData.map((ride, index) => {
					const scaleStyle = {
						transform: [
							{
								scale: interpolations[index].scale,
							},
						],
					};
					return (
						<Marker
							key={index}
							coordinate={{
								latitude: parseFloat(ride.pickUpPoint.lat),
								longitude: parseFloat(ride.pickUpPoint.lng),
							}}
							onPress={(e) => onMarkerPress(e)}>
							<Animated.View style={[styles.markerWrap]}>
								<Animated.Image
									source={require("../..//assets/images/map_marker.png")}
									style={[styles.marker, scaleStyle]}
									resizeMode="cover"
								/>
							</Animated.View>
						</Marker>
					);
				})}
			</MapView>

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
						Platform.OS === "android" ? SPACING_FOR_CARD_INSET : 0,
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
				)}>
				{serverData.map((ride, index) => (
					<View style={styles.card} key={index}>
						<Text>{ride.status}</Text>
					</View>
				))}
			</Animated.ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	markerWrap: {
		alignItems: "center",
		justifyContent: "center",
		width: 50,
		height: 50,
	},
	marker: {
		width: 30,
		height: 30,
	},
	scrollView: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		paddingVertical: 10,
	},
	card: {
		// padding: 10,
		elevation: 2,
		backgroundColor: "#FFF",
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		marginHorizontal: 10,
		shadowColor: "#000",
		shadowRadius: 5,
		shadowOpacity: 0.3,
		shadowOffset: { x: 2, y: -2 },
		height: CARD_HEIGHT,
		width: CARD_WIDTH,
		overflow: "hidden",
	},
});

export default ShowAllPotentialPassengers;
