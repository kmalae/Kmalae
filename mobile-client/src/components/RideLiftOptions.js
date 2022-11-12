import React from "react";
import { Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";

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
					navigation.navigate("GetRide", { isUpdating: false })
				}>
				<Image
					style={RideLiftStyle.image}
					source={require("../../assets/images/ride.png")}
				/>
				<Text style={RideLiftStyle.text}>Get Ride</Text>
				<AntDesign
					style={RideLiftStyle.icon}
					name="rightcircleo"
					size={24}
					color="black"
				/>
			</OptionsTouchOpacity>

			<OptionsTouchOpacity
				onPress={() =>
					navigation.navigate("ShowAllUserVehicles", { isUpdating: false })
				}>
				<Image
					style={RideLiftStyle.image}
					source={require("../../assets/images/lift.png")}
				/>
				<Text style={RideLiftStyle.text}>Give Ride</Text>
				<AntDesign
					style={RideLiftStyle.icon}
					name="rightcircleo"
					size={24}
					color="black"
				/>
			</OptionsTouchOpacity>
		</OptionsContainer>
	);
};

const OptionsContainer = styled.SafeAreaView`
	display: flex;
	flex-direction: row;
	justifycontent: center;
	alignitems: center;
	margintop: 10%;
`;
const OptionsTouchOpacity = styled.TouchableOpacity`
	background-color: #d1d3d4;
	border-radius: 4px;
	width: 40%;
	padding: 5% 0 5% 0;
	margin: 0 auto;
`;

const RideLiftStyle = StyleSheet.create({
	image: {
		resizeMode: "contain",
		width: 90,
		height: 90,
		marginLeft: 25,
		display: "flex",
		flexDirection: "row",
	},

	text: {
		marginTop: 10,
		marginLeft: 25,
	},

	icon: {
		marginTop: 18,
		marginLeft: 25,
	},

	bar: {
		width: 150,
		height: 210,
		backgroundColor: "#D1D3D4",
		borderRadius: 4,
	},
});
export default RideLiftOptions;
