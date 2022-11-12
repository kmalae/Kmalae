import { configureStore } from "@reduxjs/toolkit";

// importing slices
import CurrentUserSlice from "./slices/CurrentUserSlice";
import FirstFormSlice from "./slices/FirstFormSlice";
import SecondFormSlice from "./slices/SecondFormSlice";
import ThirdFormSlice from "./slices/ThirdFormSlice";
import SignupErrorMessagesSlice from "./slices/SignupErrorMessagesSlice";
import TopupSlice from "./slices/TopupSlice";

import RideLiftSlice from "./slices/RideLiftSlice";

import ReviewSlice from "./slices/ReviewSlice";
import PaymentSlice from "./slices/PaymentSlice";

export const store = configureStore({
	reducer: {
		currentUser: CurrentUserSlice,
		firstForm: FirstFormSlice,
		secondForm: SecondFormSlice,
		thirdForm: ThirdFormSlice,
		signupErrorMessages: SignupErrorMessagesSlice,
		topup: TopupSlice,
		rideLift: RideLiftSlice,
		review: ReviewSlice,
		payment: PaymentSlice,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});
