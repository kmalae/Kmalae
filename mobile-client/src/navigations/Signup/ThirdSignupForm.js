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

import {
	selectUserImage,
	setUserImage,
	selectImageID,
	setImageID,
} from "../../slices/ThirdFormSlice";

const avatarImagesSet = [
	{
		id: 1,
		image: require("../../../assets/images/avatars/avatar_1.png"),
		uri: "../../../assets/images/avatars/avatar_1.png",
	},
	{
		id: 2,
		image: require("../../../assets/images/avatars/avatar_2.png"),
		uri: "../../../assets/images/avatars/avatar_2.png",
	},
	{
		id: 3,
		image: require("../../../assets/images/avatars/avatar_3.png"),
		uri: "../../../assets/images/avatars/avatar_3.png",
	},
	{
		id: 4,
		image: require("../../../assets/images/avatars/avatar_4.png"),
		uri: "../../../assets/images/avatars/avatar_4.png",
	},
	{
		id: 5,
		image: require("../../../assets/images/avatars/avatar_5.png"),
		uri: "../../../assets/images/avatars/avatar_5.png",
	},
	{
		id: 6,
		image: require("../../../assets/images/avatars/avatar_6.png"),
		uri: "../../../assets/images/avatars/avatar_6.png",
	},
	{
		id: 7,
		image: require("../../../assets/images/avatars/avatar_7.png"),
		uri: "../../../assets/images/avatars/avatar_7.png",
	},
	{
		id: 8,
		image: require("../../../assets/images/avatars/avatar_8.png"),
		uri: "../../../assets/images/avatars/avatar_8.png",
	},
];

const ThirdSignupForm = ({ delay, setDelay }) => {
	const dispatch = useDispatch();
	const imageID = useSelector(selectImageID);

	const generateBase64 = async (image) => {
		await fetch(Image.resolveAssetSource(image).uri).then((result) => {
			const blob = JSON.stringify(result.blob());
			console.log({ blob });
			var reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = () => console.log(reader.result);
		});
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			setDelay(() => false);
		}, 500);
		return () => clearTimeout(timer);
	}, [delay]);

	return !delay ? (
		<AvatarsFormContainer>
			<SelectedAvatarContainer>
				<SelectedAvatarImage
					source={
						avatarImagesSet.filter((image) => {
							return image.id === imageID;
						})[0].image
					}
					PlaceholderContent={<ActivityIndicator />}
				/>
			</SelectedAvatarContainer>
			<AvatarsContainer>
				{avatarImagesSet.map(({ id, image, uri }) => {
					return (
						id <= 4 && (
							<AvatarContainer
								key={id}
								onPress={() => {
									generateBase64(image);
									dispatch(setImageID(id));
									// dispatch(setUserImage(URL.createObjectURL(uri)));
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
				{avatarImagesSet.map(({ id, image, uri }) => {
					return (
						id > 4 && (
							<AvatarContainer
								key={id}
								onPress={() => {
									generateBase64(image);
									dispatch(setImageID(id));
									// dispatch(setUserImage(URL.createObjectURL(uri)));
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
	align-items: center;
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
