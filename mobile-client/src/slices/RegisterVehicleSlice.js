import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	brandID: null,
	brandName: null,
	modelID: null,
	modelName: null,
	MPG: null,
	rating: null,
	country: null,
	vehicleRegistrationSkippable: true,
};

const registerVehicleSlice = createSlice({
	name: "registerVehicle",
	initialState,
	reducers: {
		setBrandID: (state, action) => {
			state.brandID = action.payload;
		},
		setModelID: (state, action) => {
			state.modelID = action.payload;
		},
		setBrandName: (state, action) => {
			state.brandName = action.payload;
		},
		setModelName: (state, action) => {
			state.modelName = action.payload;
		},
		setMPG: (state, action) => {
			state.MPG = action.payload;
		},
		setRating: (state, action) => {
			state.rating = action.payload;
		},
		setCountry: (state, action) => {
			state.country = action.payload;
		},
		setVehicleRegistrationSkippable: (state, action) => {
			state.vehicleRegistrationSkippable = action.payload;
		},
	},
});

export const {
	setBrandID,
	setModelID,
	setBrandName,
	setModelName,
	setMPG,
	setRating,
	setCountry,
	setVehicleRegistrationSkippable,
} = registerVehicleSlice.actions;

export const selectBrandID = (state) => state.registerVehicle.brandID;
export const selectModelID = (state) => state.registerVehicle.modelID;
export const selectBrandName = (state) => state.registerVehicle.brandName;
export const selectModelName = (state) => state.registerVehicle.modelName;
export const selectMPG = (state) => state.registerVehicle.MPG;
export const selectRating = (state) => state.registerVehicle.rating;
export const selectCountry = (state) => state.registerVehicle.country;
export const selectVehicleRegistrationSkippable = (state) =>
	state.registerVehicle.vehicleRegistrationSkippable;

export default registerVehicleSlice.reducer;
