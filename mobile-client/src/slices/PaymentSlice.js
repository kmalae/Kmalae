import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	// id: null,
	image: null,
	name: null,
	destination: null,
	amount: null,
	travelTimeInformation: null,
};

const paymentSlice = createSlice({
	name: "payment",
	initialState,
	reducers: {
		// setID: (state, action) => {
		//     state.id = action.payload;
		// },
		setImage: (state, action) => {
			state.image = action.payload;
		},

		setName: (state, action) => {
			state.name = action.payload;
		},

		setDestination: (state, action) => {
			state.destination = action.payload;
		},
		setAmount: (state, action) => {
			state.amount = action.payload;
		},

		setTravelTimeInformation: (state, action) => {
			state.travelTimeInformation = action.payload;
		},
	},
});

export const {
	setID,
	setImage,
	setName,
	setDestination,
	setAmount,
	setTravelTimeInformation,
} = paymentSlice.actions;

// export const selectID = (state) => state.payment.id;
export const selectImage = (state) => state.payment.image;
export const selectName = (state) => state.payment.name;
export const selectDestination = (state) => state.payment.destination;
export const selectAmount = (state) => state.payment.amount;
export const selectTravelTimeInformation = (state) =>
	state.payment.travelTimeInformation;

export default paymentSlice.reducer;
