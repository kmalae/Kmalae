import { SafeAreaView, Text } from "react-native";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import axios from "axios";
import config from "../../config";
import { useDispatch } from "react-redux";
import { setVehicleID } from "../slices/RideLiftSlice";
import { useNavigation } from "@react-navigation/native";

const ShowAllUserVehicles = ({ route }) => {
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const isUpdating = route.params.isUpdating;

	const [serverData, setServerData] = useState([]);

	useEffect(() => {
		axios
			.get(`${config.KMALAE_DOMAIN}/api/users/getUserVehicles`)
			.then((res) => {
				setServerData(res.data);
			})
			.catch((error) => console.log(error.response.data.errors));
	}, []);

	return (
		<SafeAreaView>
			<HeaderText>Select Car</HeaderText>
			<VehiclesScrollView>
				<VehiclesFlatList
					data={serverData}
					keyExtractor={(item) => item.id}
					ListEmptyComponent={
						<Text
							style={{
								marginLeft: "auto",
								marginRight: "auto",
								marginTop: "50%",
							}}>
							No vehicle to show
						</Text>
					}
					renderItem={({
						item: { carBrand, carModel, id, carImage },
						item,
					}) => (
						<VehicleTouchOpacity
							onPress={() => {
								dispatch(setVehicleID(id));
								navigation.navigate("GiveRide", {
									isUpdating: isUpdating,
								});
							}}>
							{/* <Image 
                          
                          // source={require(carImage.data)}
                      /> */}
							<RideItem>{carBrand}</RideItem>
							<Text>{carModel}</Text>
						</VehicleTouchOpacity>
					)}
				/>
			</VehiclesScrollView>
		</SafeAreaView>
	);
};

const HeaderText = styled.Text`
	margin: 10% auto 0 auto;
	padding: 5% 0;
`;

const VehiclesFlatList = styled.FlatList`
	width: 95%;
	${"" /* border: 2px solid red; */}
	margin: 0 auto;
`;

const VehicleTouchOpacity = styled.TouchableOpacity`
	display: flex;
	background-color: #d1d3d4;
	padding: 2.5%;
	width: 90%;
	height: 40;
	border-radius: 5px;
	margin: 0 auto 3% auto;
	border: 2px solid yellow;
	flex-direction: row;
	justify-content: space-between;
`;

const RideItem = styled.Text`
	height: 100%;
`;

const VehiclesScrollView = styled.View`
	height: 75%;
`;

const RideModalView = styled.View`
	background-color: white;
	margin: 50% auto 0 auto;
	padding: 5%;
	width: 90%;
`;
const ModalRowView = styled.View`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-bottom: 4%;
`;

const ButtonsModalRowView = styled.View`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	alignitems: center;
`;
const InModalButton = styled.TouchableOpacity`
	background-color: #d1d3d4;
	padding: 3%;
`;

export default ShowAllUserVehicles;
