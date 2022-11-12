// import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import tw from "tailwind-react-native-classnames";
import { useState } from "react";
import UserDetails from "../components/UserDetails";
import ReviewPart from "../components/ReviewPart";
import { useSelector } from "react-redux";
// import { selectTravelTimeInformation,selectImage, selectName, selectAmount, selectDestination} from "../slice/navSlice";

const ReviewScreen = () => {
	return (
		<View>
			<View style={tw`h-1/3`}>
				<UserDetails />
			</View>

			<View style={tw`h-2/3`}>
				<ReviewPart />
			</View>
		</View>
	);
};

export default ReviewScreen;
