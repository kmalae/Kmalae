import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	firstNameError: null,
	lastNameError: null,
	DOBError: null,
	IDNumberError: null,
	phoneNumberError: null,
	emailError: null,
	passwordError: null,
	confirmPasswordError: null,
	userImageError: null,
	firstFormFilled: false,
	secondFormFilled: false,
};

const signupErrorMessagesSlice = createSlice({
	name: "signupErrorMessages",
	initialState,
	reducers: {
		setFirstNameError: (state, action) => {
			state.firstNameError = action.payload;
		},
		setLastNameError: (state, action) => {
			state.lastNameError = action.payload;
		},
		setDOBError: (state, action) => {
			state.DOBError = action.payload;
		},
		setIDNumberError: (state, action) => {
			state.IDNumberError = action.payload;
		},
		setPhoneNumberError: (state, action) => {
			state.phoneNumberError = action.payload;
		},
		setEmailError: (state, action) => {
			state.emailError = action.payload;
		},
		setPasswordError: (state, action) => {
			state.passwordError = action.payload;
		},
		setConfirmPasswordError: (state, action) => {
			state.confirmPasswordError = action.payload;
		},
		setUserImageError: (state, action) => {
			state.userImageError = action.payload;
		},
		setFirstFormFilled: (state, action) => {
			state.firstFormFilled = action.payload;
		},
		setSecondFormFilled: (state, action) => {
			state.secondFormFilled = action.payload;
		},
	},
});

export const {
	setFirstNameError,
	setLastNameError,
	setDOBError,
	setIDNumberError,
	setPhoneNumberError,
	setEmailError,
	setPasswordError,
	setConfirmPasswordError,
	setUserImageError,
	setFirstFormFilled,
	setSecondFormFilled,
} = signupErrorMessagesSlice.actions;

export const selectFirstNameError = (state) =>
	state.signupErrorMessages.firstNameError;
export const selectLastNameError = (state) =>
	state.signupErrorMessages.lastNameError;
export const selectDOBError = (state) => state.signupErrorMessages.DOBError;
export const selectIDNumberError = (state) =>
	state.signupErrorMessages.IDNumberError;
export const selectPhoneNumberError = (state) =>
	state.signupErrorMessages.phoneNumberError;
export const selectEmailError = (state) => state.signupErrorMessages.emailError;
export const selectPasswordError = (state) =>
	state.signupErrorMessages.passwordError;
export const selectConfirmPasswordError = (state) =>
	state.signupErrorMessages.confirmPasswordError;
export const selectUserImageError = (state) =>
	state.signupErrorMessages.userImageError;
export const selectFirstFormFilled = (state) =>
	state.signupErrorMessages.firstFormFilled;
export const selectSecondFormFilled = (state) =>
	state.signupErrorMessages.secondFormFilled;

export default signupErrorMessagesSlice.reducer;
