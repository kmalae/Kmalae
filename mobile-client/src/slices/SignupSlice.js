import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	firstName: "",
	lastName: "",
	DOB: "",
	IDNumber: "",
	phoneNumber: "",
	email: "",
	password: "",
	confirmPassword: "",
	avatarID: 1,
};

const signupSlice = createSlice({
	name: "signup",
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
		setEmail: (state, action) => {
			state.email = action.payload;
		},
		setPassword: (state, action) => {
			state.password = action.payload;
		},
		setConfirmPassword: (state, action) => {
			state.confirmPassword = action.payload;
		},
		setAvatarID: (state, action) => {
			state.avatarID = action.payload;
		},
	},
});

export const {
	setFirstName,
	setLastName,
	setDOB,
	setIDNumber,
	setPhoneNumber,
	setEmail,
	setPassword,
	setConfirmPassword,
	setAvatarID,
} = signupSlice.actions;

export const selectFirstName = (state) => state.signup.firstName;
export const selectLastName = (state) => state.signup.lastName;
export const selectDOB = (state) => state.signup.DOB;
export const selectIDNumber = (state) => state.signup.IDNumber;
export const selectPhoneNumber = (state) => state.signup.phoneNumber;
export const selectEmail = (state) => state.signup.email;
export const selectPassword = (state) => state.signup.password;
export const selectConfirmPassword = (state) => state.signup.confirmPassword;
export const selectAvatarID = (state) => state.signup.avatarID;

export default signupSlice.reducer;
