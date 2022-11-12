import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	currentUser: null,
};

const currentUserSlice = createSlice({
	name: "currentUser",
	initialState,
	reducers: {
		setCurrentUser: (state, action) => {
			state.currentUser = action.payload;
		},
	},
});

export const { setCurrentUser } = currentUserSlice.actions;

export const selectCurrentUser = (state) => state.currentUser.currentUser;

export default currentUserSlice.reducer;
