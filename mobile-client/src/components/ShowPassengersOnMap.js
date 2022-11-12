import React, { Component } from "react";
import MapView, { Marker } from "react-native-maps";
import {
	StyleSheet,
	Dimensions,
	Animated,
	View,
	Platform,
	Text,
} from "react-native";
import axios from "axios";
import config from "../../config";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const CARD_WIDTH = width * 0.8;
const CARD_HEIGHT = 220;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

export default class ShowPassengersOnMap extends Component {
	constructor(props) {
		super(props);
		this.state = { serverData: [] };
		this._scrollView = React.createRef();
		this._map = React.createRef();
		this.mapIndex = 0;
		this.mapAnimation = new Animated.Value(0);
	}

	componentDidMount() {
		axios
			.post(`${config.KMALAE_DOMAIN}/api/recomm/getMutualRequests`, {
				destination: {
					lat: this.props.destination.location.lat,
					lng: this.props.destination.location.lng,
				},
				timeOfDeparture: this.props.timeOfDeparture,
				acceptableRadius: this.props.radius,
			})
			.then((res) => {
				this.setState({ serverData: res.data });
				console.log(res.data);
				console.log(this.state.serverData);
			});
		this.animateMarker();
		console.log("mount");
	}

	componentDidUpdate() {
		this.animateMarker();
		console.log("update");
	}

	componentWillUnmount() {
		this.animateMarker();
		console.log("will");
	}

	mapMarkers = () => {
		return this.state.serverData.map((ride) => (
			<Marker
				key={ride.id}
				coordinate={{
					latitude: parseFloat(ride.pickUpPoint.lat),
					longitude: parseFloat(ride.pickUpPoint.lng),
				}}
				// title={report.location}
				// description={report.comments}
			/>
		));
	};

	mapCards = () => {
		return this.state.serverData.map((ride) => (
			<View key={ride.id} style={styles.card}>
				<Text>{ride.status}</Text>
			</View>
		));
	};

	animateMarker = () => {
		this.mapAnimation.addListener(({ value }) => {
			let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
			if (index >= this.state.serverData.length) {
				index = this.state.serverData.length - 1;
			}
			if (index <= 0) {
				index = 0;
			}

			clearTimeout(regionTimeout);

			const regionTimeout = setTimeout(() => {
				if (this.mapIndex !== index) {
					this.mapIndex = index;
					const { pickUpPoint } = this.state.serverData[index];
					this._map.current.animateToRegion(
						{
							latitude: parseFloat(pickUpPoint.lat),
							longitude: parseFloat(pickUpPoint.lng),
							latitudeDelta: 0.005,
							longitudeDelta: 0.005,
						},
						350
					);
				}
			}, 10);
		});
	};

	render() {
		return (
			<View>
				<MapView
					ref={this._map}
					style={styles.map}
					mapType="mutedStandard"
					initialRegion={{
						latitude: 24.394,
						longitude: 54.585,
						latitudeDelta: 3.115,
						longitudeDelta: 3.115,
					}}>
					{/* driver currentLocation */}
					<Marker
						coordinate={{
							latitude: parseFloat(this.props.origin.location.lat),
							longitude: parseFloat(this.props.origin.location.lng),
						}}
						title={"You Are Here"}
						pinColor={"green"}
						// description={report.comments}
					/>

					{/* all Passengers pick-up points */}
					{this.mapMarkers()}
				</MapView>

				<Animated.ScrollView
					ref={this._scrollView}
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
										x: this.mapAnimation,
									},
								},
							},
						],
						{ useNativeDriver: true }
					)}>
					{this.state.serverData.map((ride) => (
						<View key={ride.id} style={styles.card}>
							<Text>{ride.status}</Text>
						</View>
					))}
				</Animated.ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	map: {
		minHeight: "100%",
		zIndex: 0,
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
