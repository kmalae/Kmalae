import { ImageBackground, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import styled from "styled-components";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";

import RideLiftOptions from "../components/RideLiftOptions";

import {
	selectTransitionDelay,
	setTransitionDelay,
} from "../slices/CommonSlice";

const HomeScreen = () => {
	const navigator = useNavigation();
	const route = useRoute();
	const dispatch = useDispatch();
	const transitionDelay = useSelector(selectTransitionDelay);

	useEffect(() => {
		const timer = setTimeout(() => {
			dispatch(setTransitionDelay(false));
		}, 500);
		return () => clearTimeout(timer);
	}, []);

	return (
		<View style={styles.outerContainer}>
			<ImageBackground
				source={require("../../assets/images/kmalae-bg-2.jpg")}
				style={styles.backgroundImage}
			></ImageBackground>
			<View style={styles.fader}></View>
			<View style={styles.container}>
				{!transitionDelay ? (
					<>
						<HeaderContainer>
							<LogoContainer
								onPress={() => {
									if (route.name !== "HomeScreen")
										navigator.replace("HomeScreen");
								}}
							>
								<Logo source={require("../../assets/images/logo.png")} />
							</LogoContainer>
							<UserAvatarContainer>
								<UserAvatar
									source={require("../../assets/images/avatars/avatar_1.png")}
								/>
							</UserAvatarContainer>
						</HeaderContainer>
						<RideLiftOptions />
						<ListButtonsContainer>
							<ListButton
								onPress={() => {
									navigator.navigate("RideRequestsListScreen");
								}}
							>
								<TextContainer>Show all Rides</TextContainer>
							</ListButton>
							<ListButton
								onPress={() => {
									navigator.navigate("LiftRequestsListScreen");
								}}
							>
								<TextContainer>Show all Lifts</TextContainer>
							</ListButton>
						</ListButtonsContainer>
						<QuickLocationSelectionsContainer>
							<QuickLocationSelections>
								<TextContainer>Burj Khalifa, Dubai, UAE</TextContainer>
							</QuickLocationSelections>
							<QuickLocationSelections>
								<TextContainer>Burj Khalifa, Dubai, UAE</TextContainer>
							</QuickLocationSelections>
							<QuickLocationSelections>
								<TextContainer>Burj Khalifa, Dubai, UAE</TextContainer>
							</QuickLocationSelections>
							<QuickLocationSelections>
								<TextContainer>Burj Khalifa, Dubai, UAE</TextContainer>
							</QuickLocationSelections>
							<QuickLocationSelections>
								<TextContainer>Burj Khalifa, Dubai, UAE</TextContainer>
							</QuickLocationSelections>
						</QuickLocationSelectionsContainer>
						<AddQuickSelectionButtonContainer>
							<AddQuickSelectionButton>
								<Icon name="add" type="fontawesome" size={25} color="white" />
							</AddQuickSelectionButton>
						</AddQuickSelectionButtonContainer>
					</>
				) : (
					<></>
				)}
			</View>
		</View>
	);
};

export default HomeScreen;

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

const LogoContainer = styled.TouchableOpacity`
	width: 60px;
	height: 60px;
`;

const Logo = styled.Image`
	width: 100%;
	height: 100%;
`;

const UserAvatarContainer = styled.TouchableOpacity`
	width: 45px;
	height: 49px;
	padding: 1px;
	border: 2px solid gray;
	border-radius: 100%;
`;

const UserAvatar = styled.Image`
	width: 40px;
	height: 42px;
	border-radius: 100%;
`;

const ListButtonsContainer = styled.View`
	width: 90%;
	height: 80px;
	margin-top: 10%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 5%;
`;

const ListButton = styled.TouchableOpacity`
	width: 150px;
	height: 100%;
	background-color: #1b6285;
	border-radius: 5%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const TextContainer = styled.Text`
	margin: 0 !important;
	padding: 0 !important;
	color: white;
	font-size: 18px;
`;

const QuickLocationSelectionsContainer = styled.ScrollView`
	width: 90%;
	margin-bottom: 25%;
`;

const QuickLocationSelections = styled.TouchableOpacity`
	width: 100%;
	height: 40px;
	border-bottom-width: 1px;
	border-color: lightgreen;
	margin-bottom: 10px;
	padding-left: 5px;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
`;

const AddQuickSelectionButtonContainer = styled.View`
	position: absolute;
	bottom: 6%;
	width: 90%;
	height: 40px;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
`;

const AddQuickSelectionButton = styled.TouchableOpacity`
	height: 85%;
	width: 33px;
	background-color: green;
	border-radius: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;
