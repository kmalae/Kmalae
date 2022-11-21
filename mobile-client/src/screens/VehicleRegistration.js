import { View, Text, StyleSheet, ImageBackground } from "react-native";
import React, { useEffect } from "react";
import styled from "styled-components";
import { Icon, Image } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import config from "../../config";

import {
	selectVehicleRegistrationSkippable,
	selectBrandID,
	setBrandID,
	selectModelID,
	setModelID,
	selectBrandName,
	setBrandName,
	selectModelName,
	setModelName,
	selectMPG,
	setMPG,
	selectRating,
	setRating,
	selectCountry,
	setCountry,
} from "../slices/RegisterVehicleSlice";

import { VehicleDetails } from "../../Vehicles";
import axios from "axios";

import {
	selectTransitionDelay,
	setTransitionDelay,
} from "../slices/CommonSlice";

const VehicleRegistration = () => {
	const navigator = useNavigation();
	const dispatch = useDispatch();

	const transitionDelay = useSelector(selectTransitionDelay);

	const vehicleRegistrationSkippable = useSelector(
		selectVehicleRegistrationSkippable
	);
	let brandID = useSelector(selectBrandID);
	let modelID = useSelector(selectModelID);
	let brandName = useSelector(selectBrandName);
	let modelName = useSelector(selectModelName);
	let MPG = useSelector(selectMPG);
	let rating = useSelector(selectRating);
	let country = useSelector(selectCountry);

	useEffect(() => {
		axios
			.get(`${config.KMALAE_DOMAIN}/api/users/currentUser`)
			.then((result) => {
				if (result.data.currentUser === null) navigator.replace("LoginScreen");
			});
	}, []);

	const registerVehicle = () => {
		if (
			modelID !== null &&
			brandID !== null &&
			brandName !== null &&
			modelName !== null &&
			MPG !== null &&
			rating !== null &&
			country !== null
		) {
			axios
				.post(`${config.KMALAE_DOMAIN}/api/users/registerVehicle`, {
					modelID,
					brandID,
					brandName,
					modelName,
					MPG,
					rating,
					country,
				})
				.then((result) => navigator.replace("HomeScreen"))
				.catch((error) => console.log(error.response.data.errors));
		}
	};

	return (
		<View style={styles.outerContainer}>
			<ImageBackground
				source={require("../../assets/images/kmalae-bg-2.jpg")}
				style={styles.backgroundImage}
			></ImageBackground>
			<View style={styles.fader}></View>
			<View style={styles.container}>
				<HeaderContainer>
					<LogoContainer
						onPress={() => {
							if (route.name !== "HomeScreen") navigator.replace("HomeScreen");
						}}
					>
						<Logo source={require("../../assets/images/logo.png")} />
					</LogoContainer>
				</HeaderContainer>
				<BrandSelectionContainer>
					<TextContainer style={{ fontSize: 25 }}>
						Select Your Car Brand
					</TextContainer>
					<BrandsContainer horizontal>
						{VehicleDetails.map(({ vehicleBrandID, logo, brand }) => {
							return (
								<Brand
									key={vehicleBrandID}
									style={
										vehicleBrandID === brandID ? styles.selectedIndicator : {}
									}
									onPress={() => {
										dispatch(setBrandID(vehicleBrandID));
										dispatch(setBrandName(brand));
									}}
								>
									<BrandImage
										resizeMode="stretch"
										source={{ uri: Image.resolveAssetSource(logo).uri }}
									/>
									<TextContainer style={{ fontSize: 18 }}>
										{brand}
									</TextContainer>
								</Brand>
							);
						})}
					</BrandsContainer>
				</BrandSelectionContainer>

				<ModelSelectionContainer>
					{brandID !== null && (
						<>
							<TextContainer style={{ fontSize: 25 }}>
								Select Your Car Model
							</TextContainer>
							<ModelsContainer horizontal>
								{VehicleDetails.filter((brand) => {
									return brand.vehicleBrandID === brandID;
								})[0].models.map(
									({ vehicleModelID, model, MPG, rating, country, image }) => {
										return (
											<Model
												key={vehicleModelID}
												style={
													vehicleModelID === modelID
														? styles.selectedIndicator
														: {}
												}
												onPress={() => {
													dispatch(setModelID(vehicleModelID));
													dispatch(setModelName(model));
													dispatch(setMPG(MPG));
													dispatch(setRating(rating));
													dispatch(setCountry(country));
												}}
											>
												<ModelImage
													resizeMode="stretch"
													source={{ uri: Image.resolveAssetSource(image).uri }}
												/>
												<TextContainer style={{ fontSize: 18 }}>
													{model}
												</TextContainer>
											</Model>
										);
									}
								)}
							</ModelsContainer>
						</>
					)}
				</ModelSelectionContainer>

				<ButtonsContainer>
					<VehicleRegisterButton
						disabled={brandID === null || modelID === null}
						style={{ opacity: brandID !== null && modelID !== null ? 1 : 0.6 }}
						onPress={registerVehicle}
					>
						<TextContainer style={{ fontSize: 25 }}>Register</TextContainer>
					</VehicleRegisterButton>
					{vehicleRegistrationSkippable && (
						<SkipButton onPress={() => navigator.replace("HomeScreen")}>
							<TextContainer style={{ fontSize: 20 }}>Skip</TextContainer>
							<Icon
								name="chevron-right"
								type="fontawesome"
								size={18}
								color="white"
							/>
						</SkipButton>
					)}
				</ButtonsContainer>
			</View>
		</View>
	);
};

export default VehicleRegistration;

const styles = StyleSheet.create({
	outerContainer: {
		width: "100%",
		height: "100%",
		position: "relative",
	},
	backgroundImage: {
		height: "100%",
		width: "100%",
		position: "absolute",
		top: 0,
		left: 0,
		zIndex: 0,
	},
	fader: {
		height: "100%",
		width: "100%",
		position: "absolute",
		top: 0,
		left: 0,
		zIndex: 1,
		backgroundColor: "black",
		opacity: 0.7,
	},
	container: {
		flex: 1,
		zIndex: 3,
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "center",
		position: "relative",
	},
	selectedIndicator: {
		borderColor: "yellow",
		borderWidth: 3,
	},
});

const HeaderContainer = styled.View`
	width: 95%;
	height: 10%;
	margin-top: 10%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;

const TextContainer = styled.Text`
	margin: 0 !important;
	padding: 0 !important;
	color: white;
`;

const LogoContainer = styled.TouchableOpacity`
	width: 60px;
	height: 60px;
`;

const Logo = styled.Image`
	width: 100%;
	height: 100%;
`;

const BrandSelectionContainer = styled.View`
	width: 95%;
	height: 25%;
	margin-top: 5%;
	padding-top: 5%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
`;

const BrandsContainer = styled.ScrollView`
	width: 100%;
	margin-top: 15%;
	display: flex;
	flex-direction: row;
`;

const Brand = styled.TouchableOpacity`
	width: 150px;
	height: 100%;
	margin-right: 30px;
	padding: 5px;
	background-color: #872121;
	border-radius: 10%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
`;

const BrandImage = styled.Image`
	width: 100%;
	height: 75%;
`;

const ModelSelectionContainer = styled.View`
	width: 95%;
	height: 300px;
	margin-top: 20%;
	padding-top: 5%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
`;

const ModelsContainer = styled.ScrollView`
	width: 100%;
	margin-top: 15%;
	display: flex;
	flex-direction: row;
`;

const Model = styled.TouchableOpacity`
	width: 300px;
	height: 100%;
	margin-right: 35px;
	padding: 10px;
	background-color: #1b6285;
	border-radius: 10%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
`;

const ModelImage = styled.Image`
	width: 100%;
	height: 70%;
`;

const ButtonsContainer = styled.View`
	width: 95%;
	height: 50px;
	position: absolute;
	bottom: 8%;
	margin: 0 auto;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;

const VehicleRegisterButton = styled.TouchableOpacity`
	width: 150px;
	height: 100%;
	background-color: green;
	border-radius: 10%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const SkipButton = styled.TouchableOpacity`
	width: 80px;
	height: 70%;
	position: absolute;
	right: 0;
	padding-left: 7px;
	background-color: #0a5fba;
	border-radius: 30%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;
