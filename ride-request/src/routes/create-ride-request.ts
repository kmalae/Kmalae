import express, { Request, Response } from "express";
import { body } from "express-validator";

// importing models and services
import { RideRequest } from "../models/ride-request";
import { User } from "../models/user";

// importing error-types, middlewares, types, and services
import {
	currentUser,
	NotAuthorizedError,
	validateRequest,
	LocationType,
	Location,
	BadRequestError,
} from "@kmalae.ltd/library";

const router = express.Router();

router.post(
	"/api/rides/createRideRequest",
	[
		body("pickUpPoint")
			.custom((input: LocationType) => {
				return Location(input);
			})
			.withMessage("Invalid pick up location"),
		body("destination")
			.custom((input: LocationType) => {
				return Location(input);
			})
			.withMessage("Invalid destination location"),
		body("timeOfDeparture")
			.notEmpty()
			.withMessage("Departure time must be provided")
			.isISO8601()
			.withMessage("Incorrect departure time format")
			.exists()
			.isDate()
			.withMessage("Departure time must be valid"),
	],
	currentUser,
	validateRequest,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new NotAuthorizedError();
		}

		const { pickUpPoint, destination, timeOfDeparture } = req.body;
		const { id, email } = req.currentUser;

		const existingUser = await User.findOne({
			userId: id,
		});

		if (!existingUser) {
			throw new BadRequestError("User does not exist");
		}

		const rideRequest = RideRequest.build({
			pickUpPoint,
			destination,
			timeOfDeparture,
			user: existingUser,
		});

		rideRequest.save();

		// publish data here

		res.status(201).send(rideRequest);
	}
);

export { router as createRideRequestRouter };
