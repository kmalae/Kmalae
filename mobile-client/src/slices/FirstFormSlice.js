import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	firstName: "",
	lastName: "",
	DOB: "",
	IDNumber: "",
	phoneNumber: "",
};

const firstFormSlice = createSlice({
	name: "firstForm",
	initialState,
	reducers: {
		setFirstName: (state, action) => {
			state.firstName = action.payload;
		},
		setLastName: (state, action) => {
			state.lastName = action.payload;
		},
		setDOB: (state, action) => {
			state.DOB = action.payload;
		},
		setIDNumber: (state, action) => {
			state.IDNumber = action.payload;
		},
		setPhoneNumber: (state, action) => {
			state.phoneNumber = action.payload;
		},
	},
});

export const {
	setFirstName,
	setLastName,
	setDOB,
	setIDNumber,
	setPhoneNumber,
} = firstFormSlice.actions;

export const selectFirstName = (state) => state.firstForm.firstName;
export const selectLastName = (state) => state.firstForm.lastName;
export const selectDOB = (state) => state.firstForm.DOB;
export const selectIDNumber = (state) => state.firstForm.IDNumber;
export const selectPhoneNumber = (state) => state.firstForm.phoneNumber;

export default firstFormSlice.reducer;
