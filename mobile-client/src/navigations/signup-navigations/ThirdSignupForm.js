import {
	View,
	Text,
	ActivityIndicator,
	FlatList,
	TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "react-native-elements";
import styled from "styled-components";
import { AvatarImages } from "../../../Avatars";

import { selectAvatarID, setAvatarID } from "../../slices/SignupSlice";

import {
	selectTransitionDelay,
	setTransitionDelay,
} from "../../slices/CommonSlice";

const ThirdSignupForm = () => {
	const dispatch = useDispatch();
	const transitionDelay = useSelector(selectTransitionDelay);
	const avatarID = useSelector(selectAvatarID);

	useEffect(() => {
		const timer = setTimeout(() => {
			dispatch(setTransitionDelay(false));
		}, 500);
		return () => clearTimeout(timer);
	}, [transitionDelay]);

	return !transitionDelay ? (
		<AvatarsFormContainer>
			<SelectedAvatarContainer>
				<SelectedAvatarImage
					source={
						AvatarImages.filter((avatar) => {
							return avatar.id === avatarID;
						})[0].image
					}
					PlaceholderContent={<ActivityIndicator />}
				/>
			</SelectedAvatarContainer>
			<AvatarsContainer>
				{AvatarImages.map(({ id, image }) => {
					return (
						id <= 4 && (
							<AvatarContainer
								key={id}
								onPress={() => {
									dispatch(setAvatarID(id));
								}}
							>
								<AvatarImage
									source={{ uri: Image.resolveAssetSource(image).uri }}
								/>
							</AvatarContainer>
						)
					);
				})}
			</AvatarsContainer>
			<AvatarsContainer>
				{AvatarImages.map(({ id, image }) => {
					return (
						id > 4 && (
							<AvatarContainer
								key={id}
								onPress={() => {
									dispatch(setAvatarID(id));
								}}
							>
								<AvatarImage
									source={{ uri: Image.resolveAssetSource(image).uri }}
								/>
							</AvatarContainer>
						)
					);
				})}
			</AvatarsContainer>
		</AvatarsFormContainer>
	) : (
		<></>
	);
};

export default ThirdSignupForm;

const AvatarsFormContainer = styled.View`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 0 10%;
`;

const SelectedAvatarContainer = styled.View`
	width: 100px;
	height: 110px;
	border: 3px solid lightgray;
	border-radius: 100%;
	padding: 3px;
	margin-bottom: 100px;
`;

const SelectedAvatarImage = styled.Image`
	width: 88px;
	height: 98px;
	border-radius: 100%;
	background-color: lightgray;
`;

const AvatarsContainer = styled.View`
	width: 100%;
	height: 20%;
	margin-bottom: 10px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	overflow-x: scroll;
`;

const AvatarContainer = styled.TouchableOpacity`
	width: 70px;
	height: 70px;
	padding: 2px;
	border: 2px solid gray;
	border-radius: 100%;
`;

const AvatarImage = styled.Image`
	width: 62px;
	height: 62px;
	border-radius: 100%;
	background-color: lightgray;
`;
