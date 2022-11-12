import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	email: "",
	password: "",
	confirmPassword: "",
};

const secondFormSlice = createSlice({
	name: "secondForm",
	initialState,
	reducers: {
		setEmail: (state, action) => {
			state.email = action.payload;
		},
		setPassword: (state, action) => {
			state.password = action.payload;
		},
		setConfirmPassword: (state, action) => {
			state.confirmPassword = action.payload;
		},
	},
});

export const { setEmail, setPassword, setConfirmPassword } =
	secondFormSlice.actions;

export const selectEmail = (state) => state.secondForm.email;
export const selectPassword = (state) => state.secondForm.password;
export const selectConfirmPassword = (state) =>
	state.secondForm.confirmPassword;

export default secondFormSlice.reducer;
