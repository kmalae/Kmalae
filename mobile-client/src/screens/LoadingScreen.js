import React, { useEffect } from "react";
import {
	View,
	StyleSheet,
	ImageBackground,
	Dimensions,
	Image,
} from "react-native";
import styled from "styled-components";
import axios from "axios";
import config from "../../config";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { setWidth, setHeight } from "../slices/CommonSlice";

const LoadingScreen = () => {
	const dispatch = useDispatch();
	const navigator = useNavigation();

	useEffect(() => {
		const timer = setTimeout(() => {
			dispatch(setWidth(Dimensions.get("window").width));
			dispatch(setHeight(Dimensions.get("window").height));
			axios
				.get(`${config.KMALAE_DOMAIN}/api/users/currentuser`)
				.then((response) => {
					if (response.data.currentUser === null) {
						navigator.replace("LoginScreen");
					} else {
						navigator.replace("LoginScreen");
					}
				})
				.catch((error) => console.log(error));
		}, 1500);
		return () => clearTimeout(timer);
	});

	useEffect(() => {}, []);

	return (
		<View style={styles.outerContainer}>
			<ImageBackground
				source={require("../../assets/images/kmalae-bg-2.jpg")}
				style={styles.backgroundImage}></ImageBackground>
			<View style={styles.fader}></View>
			<View style={styles.container}>
				<LogoImage source={require("../../assets/images/logo.png")} />
			</View>
		</View>
	);
};

export default LoadingScreen;

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
		justifyContent: "center",
		alignItems: "center",
	},
});

const LogoImage = styled.Image`
	width: 239px;
	height: 180px;
`;
