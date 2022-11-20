import { configureStore } from "@reduxjs/toolkit";

// importing slices
import CommonSlice from "./slices/CommonSlice";
import CurrentUserSlice from "./slices/CurrentUserSlice";
import SignupSlice from "./slices/SignupSlice";
import RegisterVehicleSlice from "./slices/RegisterVehicleSlice";
import SignupErrorMessagesSlice from "./slices/SignupErrorMessagesSlice";
import TopupSlice from "./slices/TopupSlice";
import RideLiftSlice from "./slices/RideLiftSlice";
import ReviewSlice from "./slices/ReviewSlice";
import PaymentSlice from "./slices/PaymentSlice";

export const store = configureStore({
	reducer: {
		common: CommonSlice,
		currentUser: CurrentUserSlice,
		signup: SignupSlice,
		registerVehicle: RegisterVehicleSlice,
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
