import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	width: null,
	height: null,
	transitionDelay: true,
};

const commonSlice = createSlice({
	name: "common",
	initialState,
	reducers: {
		setWidth: (state, action) => {
			state.width = action.payload;
		},
		setHeight: (state, action) => {
			state.height = action.payload;
		},
		setTransitionDelay: (state, action) => {
			state.transitionDelay = action.payload;
		},
	},
});

export const { setWidth, setHeight, setAmountToTopup, setTransitionDelay } =
	commonSlice.actions;

export const selectWidth = (state) => state.common.width;
export const selectHeight = (state) => state.common.height;
export const selectTransitionDelay = (state) => state.common.transitionDelay;

export default commonSlice.reducer;
