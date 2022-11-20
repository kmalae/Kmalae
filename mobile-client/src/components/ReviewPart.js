import {
	View,
	StyleSheet,
	TextInput,
	Text,
	TouchableOpacity,
} from "react-native";
// import { TextInput } from "react-native-elements";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { Icon } from "react-native-elements";
import "react-native-gesture-handler";
import axios from "axios";
import config from "../../config";
import { useSelector } from "react-redux";
import {
	selectStand,
	selectmatchRide,
	selectcommentedId,
	selectreviewId,
} from "../slices/ReviewSlice";

const ReviewPart = () => {
	const stand = useSelector(selectStand);
	const matchRide = useSelector(selectmatchRide);
	const commentedId = useSelector(selectcommentedId);
	const reviewId = useSelector(selectreviewId);
	console.log("------------------------");
	console.log(typeof stand, stand);
	console.log(typeof matchRide, matchRide);
	console.log(typeof commentedId, commentedId);
	const [initialComment, setInitialComment] = useState();
	const [defaultRating, setdefaultRating] = useState(0);
	const [maxRating] = useState([1, 2, 3, 4, 5]);
	const [input, setInput] = useState("");
	
 
 
	 

	useEffect(()=>{
		if(stand=="driver"){
			axios
			.post(`${config.KMALAE_DOMAIN}/api/review/getReviewInfo`, {
				reviewID: reviewId,
				stance: stand,
			})
			.then((response)=> {
			setdefaultRating(response.data.driverRated)
			setInitialComment(response.data.driverCommented)
		})
		}else{
			axios
			.post(`${config.KMALAE_DOMAIN}/api/review/getReviewInfo`, {
				reviewID: reviewId,
				stance: stand,
			}).then((response)=> {
				setdefaultRating(response.data.passengerRated)
				setInitialComment(response.data.passengerCommented)
			})
		}
	},[])
	 
	const CustomRatingBar = () => {
		return (
			<View style={styles.CustomerRatingBarStyle}>
				{maxRating.map((item, key) => {
					return (
						<TouchableOpacity
							activeOpacity={0.3}
							key={item}
							onPress={() => setdefaultRating(item)}>
							<Icon
								name={item <= defaultRating ? "star" : "star-outline"}
								type="material"
								size={45}
								color="#D68910"
							/>
						</TouchableOpacity>
					);
				})}
			</View>
		);
	};



	const fetchData = async () => {
		if (stand == "driver") {

			await axios
				.post(`${config.KMALAE_DOMAIN}/api/review/updateDriverReview`, {
					passengerID: commentedId.toString(),
					matchRequestID: matchRide.toString(),
					driverRating: defaultRating,
					driverComment: input,
				})
				// .then((response)=>setComm(response.data.driverCommented))
				.then((response) => console.log(response.data))
				// .catch((error) => {
				// 	console.log(error.response.data.errors);
				// });
		
		} else {
			console.log("Entered Here")
			console.log({defaultRating, input})
			await axios
				.post(`${config.KMALAE_DOMAIN}/api/review/updatePassengerReview`, {
					driverID: commentedId.toString(),
					matchRequestID: matchRide.toString(),
					passengerRating: defaultRating,
					passengerComment: input,
				})
				.then((response) => console.log(response.data))
				.catch((error) => {
					console.log(error.response.data.errors);
				});
		}
	};

	return (
		<View>
			<RatingContainer>
				<Text style={styles.textStyle}> Please rate here!</Text>
				<CustomRatingBar />
				<Text style={styles.textStyle}>
					{defaultRating + " / " + maxRating.length}
				</Text>
				<InputContainer>
					<TextInput
						onChangeText={(text) => setInput(text)}
						value={input.text}
						multiline={true}
						numberOfLines={18}
						placeholder="Comment . . . ."
						placeholderTextColor="grey"> 
						{initialComment}
						</TextInput>
				</InputContainer>
				<TouchableOpacity
					onPress={() => fetchData()}
					activeOpacity={0.7}
					style={styles.buttonStyle}>
					<Text style={styles.buttonTextStyle}>Submit</Text>
				</TouchableOpacity>
			</RatingContainer>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	CustomerRatingBarStyle: {
		justifyContent: "center",
		flexDirection: "row",
		marginTop: 10,
	},
	starImgStyle: {
		width: 40,
		height: 40,
		resizeMode: "cover",
	},
	textStyle: {
		marginTop: 15,
		textAlign: "center",
		fontSize: 22,
		color: "white"
	},
	buttonTextStyle: {
		textAlign: "center",
		fontSize: 20,
		color: "white",
	},
	buttonStyle: {
		justifyContent: "center",
		alignItems: "center",
		marginTop: 5,
		marginBottom: 155,
		marginLeft: 120,
		marginRight: 120,
		padding: 10,
		borderRadius: 10,
		backgroundColor: "green",
	},
});

const InputContainer = styled.View`
	background-color: white;
	height: 4%;
	border-width: 1px;
	border-radius: 10px;
	border-color: black;
	margin-vertical: 3px;
	margin-bottom: 10px;
	padding-left: 20px;
	margin-right: 20px;
	margin-left: 20px;
	${"" /* background-color: #EBF5FB; */}
	${"" /* background-color: #FEF5E7; */}
	${"" /* background-color: #F5B7B1; */};
	${"" /* background-color: #b1f5d9; */}
	${"" /* background-color: #CDF5B1; */}
	${"" /* background-color: #F5D9B1; */}
`;

const RatingContainer = styled.View`
	${
		"" /* border-left-width: 3px;
	border-right-width: 3px; */
	}
	height: 100%;
	width: 100%;
	background-color: black;
`;

export default ReviewPart;
