import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	points: null,
	topupHistory: Array(),
	amountToTopup: null,
};

const topupSlice = createSlice({
	name: "topup",
	initialState,
	reducers: {
		setPoints: (state, action) => {
			state.points = action.payload;
		},
		setTopupHistory: (state, action) => {
			state.topupHistory = action.payload;
		},
		setAmountToTopup: (state, action) => {
			state.amountToTopup = action.payload;
		},
	},
});

export const { setPoints, setTopupHistory, setAmountToTopup } =
	topupSlice.actions;

export const selectPoints = (state) => state.topup.points;
export const selectTopupHistory = (state) => state.topup.topupHistory;
export const selectAmountToTopup = (state) => state.topup.amountToTopup;

export default topupSlice.reducer;
