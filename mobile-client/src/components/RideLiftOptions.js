import React from "react";
import { Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import { Icon } from "react-native-elements";

const data = [
	{
		id: "111",
		title: "Get a Ride",
		image: require("../../assets/images/ride.png"),
		screen: "GetRide",
	},
	{
		id: "222",
		title: "Give a Ride",
		image: require("../../assets/images/lift.png"),
		screen: "ShowAllUserVehicle",
	},
];

const RideLiftOptions = () => {
	const navigation = useNavigation();

	return (
		<OptionsContainer>
			<OptionsTouchOpacity
				onPress={() =>
					navigation.navigate("RideRequestScreen", { isUpdating: false })
				}
			>
				<Image
					style={RideLiftStyle.image}
					source={require("../../assets/images/ride.png")}
				/>
				<TextContainer>Get Ride</TextContainer>
				<Icon name="chevron-right" type="fontawesome" size={28} color="white" />
			</OptionsTouchOpacity>

			<OptionsTouchOpacity
				onPress={() =>
					navigation.navigate("ShowAllUserVehicles", { isUpdating: false })
				}
			>
				<Image
					style={RideLiftStyle.image}
					source={require("../../assets/images/lift.png")}
				/>
				<TextContainer>Give Ride</TextContainer>
				<Icon name="chevron-right" type="fontawesome" size={28} color="white" />
			</OptionsTouchOpacity>
		</OptionsContainer>
	);
};

const OptionsContainer = styled.SafeAreaView`
	width: 400px;
	height: 40%;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
	margin-top: 10%;
`;
const OptionsTouchOpacity = styled.TouchableOpacity`
	background-color: #1b6285;
	border-radius: 10%;
	width: 150px;
	height: 200px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 5% 0;
`;

const RideLiftStyle = StyleSheet.create({
	image: {
		resizeMode: "contain",
		width: 90,
		height: 90,
		display: "flex",
		flexDirection: "row",
	},
});

const TextContainer = styled.Text`
	margin: 0 !important;
	padding: 0 !important;
	font-size: 20px;
	color: white;
`;

export default RideLiftOptions;
