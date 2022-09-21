import express, { Request, Response } from "express";
import { body } from "express-validator";


// importing error-types and middlewares
import {
	BadRequestError,
	currentUser,
	validateRequest,
	RideRequestStatus,
  LocationType,
	Location,
	NotAuthorizedError
} from "@kmalae.ltd/library";
import mongoose from "mongoose";

// importing ride request doc
import { RideRequest } from "../models/ride-request";
import { User } from "../models/user";

const router = express.Router();

router.post(
	"/api/rides/updateRideRequest",
	[
    body("rideRequestID")
			.custom((input: string) => {
				return mongoose.Types.ObjectId.isValid(input);
			})
			.withMessage("Invalid ride request ID"),
		body("pickUpPoint")
			.custom((input: LocationType) => {
				return Location(input);
			})
			.withMessage("Invalid pick up location")
			.notEmpty()
			.withMessage("Pick up location must be provided"),
		body("destination")
		.custom((input: LocationType) => {
			return Location(input);
		})
			.withMessage("Invalid destination location")
			.notEmpty()
			.withMessage("Destination location must be provided"),
		body("timeOfDeparture")
			.notEmpty()
			.withMessage("Departure time must be provided")
			.isISO8601()
			.withMessage("Incorrect departure time format")
			.exists()
			.isDate()
			.withMessage("Departure time must be valid")
	],
	currentUser,
	validateRequest,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new NotAuthorizedError();
		}

		const {rideRequestID, pickUpPoint, destination, timeOfDeparture, status } = req.body;
		const { id, email } = req.currentUser;
		const existingUser = await User.findOne({
			id,
			email,
		});

		if (!existingUser) {
			throw new BadRequestError("User does not exist");
		}

		let existingRideRequest = await RideRequest.findById(rideRequestID);
		if (!existingRideRequest) throw new BadRequestError("Ride request does not exist");

		existingRideRequest
			.set({
				pickUpPoint,
        destination,
        timeOfDeparture,
        status: RideRequestStatus.Updated
			})
			.save();


		res.status(200).send(existingRideRequest);
	}
);

export { router as updateRideRequestRouter };
