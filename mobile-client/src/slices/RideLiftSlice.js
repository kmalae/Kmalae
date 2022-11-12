import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	origin: {
		location: {
			lat: 24.39349,
			lng: 54.583961,
		},
	},
	destination: {
		location: {
			lat: 0,
			lng: 0,
		},
	},
	timeOfDeparture: null,
	rideLiftID: "",
	vehicleID: "",
	acceptableRadius: 5,
};

const rideLiftSlice = createSlice({
	name: "rideLift",
	initialState,
	reducers: {
		setOrigin: (state, action) => {
			state.origin = action.payload;
		},
		setDestination: (state, action) => {
			state.destination = action.payload;
		},
		setTimeOfDeparture: (state, action) => {
			state.timeOfDeparture = action.payload;
		},
		setRideLiftID: (state, action) => {
			state.rideLiftID = action.payload;
		},
		setVehicleID: (state, action) => {
			state.vehicleID = action.payload;
		},
		setAcceptableRadius: (state, action) => {
			state.acceptableRadius = action.payload;
		},
	},
});

export const {
	setOrigin,
	setDestination,
	setTimeOfDeparture,
	setRideLiftID,
	setVehicleID,
	setAcceptableRadius,
} = rideLiftSlice.actions;

// selectors
export const selectOrigin = (state) => state.rideLift.origin;
export const selectDestination = (state) => state.rideLift.destination;
export const selectTimeOfDeparture = (state) => state.rideLift.timeOfDeparture;
export const selectRideLiftID = (state) => state.rideLift.rideLiftID;
export const selectVehicleID = (state) => state.rideLift.vehicleID;
export const selectAcceptableRadius = (state) =>
	state.rideLift.acceptableRadius;

export default rideLiftSlice.reducer;
