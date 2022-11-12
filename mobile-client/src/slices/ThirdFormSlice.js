import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	userImage: null,
	imageID: 1,
};

const thirdFormSlice = createSlice({
	name: "thirdForm",
	initialState,
	reducers: {
		setUserImage: (state, action) => {
			state.userImage = action.payload;
		},
		setImageID: (state, action) => {
			state.imageID = action.payload;
		},
	},
});

export const { setUserImage, setImageID } = thirdFormSlice.actions;

export const selectUserImage = (state) => state.thirdForm.userImage;
export const selectImageID = (state) => state.thirdForm.imageID;

export default thirdFormSlice.reducer;
