import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	driverId: null,
	matchId: null,
	avatarID: null,
	name: null,
	destination: null,
	amount: null,
	travelTimeInformation: null,
};

const paymentSlice = createSlice({
	name: "payment",
	initialState,
	reducers: {
		setdriverId: (state, action) => {
			state.driverId = action.payload;
		},

		setmatchId: (state, action) => {
			state.matchId = action.payload;
		},
		setAvatarID: (state, action) => {
			state.avatarID = action.payload;
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
	},
});

export const {
	setdriverId,
	setmatchId,
	setAvatarID,
	setName,
	setDestination,
	setAmount,
	setTravelTimeInformation,
} = paymentSlice.actions;

export const selectdriverId = (state) => state.payment.driverId;
export const selectmatchId = (state) => state.payment.matchId;
export const selectAvatarID = (state) => state.payment.avatarID;
export const selectName = (state) => state.payment.name;
export const selectDestination = (state) => state.payment.destination;
export const selectAmount = (state) => state.payment.amount;
export const selectTravelTimeInformation = (state) =>
	state.payment.travelTimeInformation;

export default paymentSlice.reducer;
