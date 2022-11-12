import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	// id: null,
	image: null,
	name: null,
	destination: null,
	amount: null,
	travelTimeInformation: null,
	stand: null,
	matchRide: null,
	commentedId: null,
};

const reviewSlice = createSlice({
	name: "review",
	initialState,
	reducers: {
		// setID: (state, action) => {
		//     state.id = action.payload;
		// },
		setImage: (state, action) => {
			state.image = action.payload;
		},

		setName: (state, action) => {
			state.name = action.payload;
		},

		setDestination: (state, action) => {
			state.destination = action.payload;
		},
		setAmount: (state, action) => {
			state.amount = action.payload;
		},

		setTravelTimeInformation: (state, action) => {
			state.travelTimeInformation = action.payload;
		},
		setStand: (state, action) => {
			state.stand = action.payload;
		},
		setmatchRide: (state, action) => {
			state.matchRide = action.payload;
		},
		setcommentedId: (state, action) => {
			state.commentedId = action.payload;
		},
	},
});

export const {
	setID,
	setImage,
	setName,
	setDestination,
	setAmount,
	setTravelTimeInformation,
	setStand,
	setmatchRide,
	setcommentedId,
} = reviewSlice.actions;

// export const selectID = (state) => state.review.id;
export const selectImage = (state) => state.review.image;
export const selectName = (state) => state.review.name;
export const selectDestination = (state) => state.review.destination;
export const selectAmount = (state) => state.review.amount;
export const selectTravelTimeInformation = (state) =>
	state.review.travelTimeInformation;
export const selectStand = (state) => state.review.stand;
export const selectmatchRide = (state) => state.review.matchRide;
export const selectcommentedId = (state) => state.review.commentedId;

export default reviewSlice.reducer;
