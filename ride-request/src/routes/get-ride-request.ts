import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

// importing models and services
import { RideRequest } from "../models/ride-request";
import { User } from "../models/user";

// importing error-types and middlewares
import {
	BadRequestError,
	currentUser,
	NotAuthorizedError,
	validateRequest,
} from "@kmalae.ltd/library";


const router = express.Router();

router.post(
	"/api/rides/getRideRequest",
	[
		body("rideRequestID")
			.custom((input: string) => {
				return mongoose.Types.ObjectId.isValid(input);
			})
			.withMessage("Invalid ride request ID"),
	],
	currentUser,
	validateRequest,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new NotAuthorizedError();
		}

		const { rideRequestID } = req.body;
    const { id, email } = req.currentUser;
		const existingUser = await User.findOne({
			id,
			email,
		});

		if (!existingUser) {
			throw new BadRequestError("User does not exist");
		}

		const existingRideRequest = await RideRequest.findById(rideRequestID);
		if (!existingRideRequest) {
			throw new BadRequestError("Ride request does not exist");
		}

		res.status(200).send(existingRideRequest);
	}
);

export { router as getRideRequestRouter };
