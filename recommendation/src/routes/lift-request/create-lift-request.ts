import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

// importing models and services
import { LiftRequest } from "../../models/lift-request";
import { User } from "../../models/user";
import { Vehicle } from "../../models/vehicle";

// importing error-types, middlewares, types, and services
import {
	currentUser,
	NotAuthorizedError,
	validateRequest,
	LocationType,
	Location,
	BadRequestError,
	natsWrapper,
} from "@kmalae.ltd/library";

// importing event publishers and listeners
import { LiftRequestCreatedPublisher } from "../../events/publish/lift-request/lift-request-created-publisher";

const router = express.Router();

router.post(
	"/api/recomm/createLiftRequest",
	[
		body("vehicleID")
			.custom((input: string) => {
				return mongoose.Types.ObjectId.isValid(input);
			})
			.withMessage("Invalid vehicle ID"),
		body("currentLocation")
			.custom((input: LocationType) => {
				return Location(input);
			})
			.withMessage("Invalid current location"),
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
			.withMessage("Departure time must be valid"),
	],
	currentUser,
	validateRequest,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new NotAuthorizedError();
		}

		const { vehicleID, currentLocation, destination, timeOfDeparture } =
			req.body;
		const { id, email } = req.currentUser;

		const existingUser = await User.findOne({
			id,
			email,
		});

		if (!existingUser) {
			throw new BadRequestError("User does not exist");
		}

		const existingVehicle = await Vehicle.findById(vehicleID);

		if (!existingVehicle) {
			throw new BadRequestError("Vehicle does not exist");
		}

		const liftRequest = LiftRequest.build({
			currentLocation,
			destination,
			timeOfDeparture,
			user: existingUser,
			vehicle: existingVehicle,
		});

		try {
			await liftRequest.save();

			// publishing lift request data
			new LiftRequestCreatedPublisher(natsWrapper.client).publish({
				id: liftRequest.id,
				currentLocation: liftRequest.currentLocation,
				destination: liftRequest.destination,
				timeOfDeparture: liftRequest.timeOfDeparture,
				user: existingUser.id,
				vehicle: existingVehicle.id,
				version: liftRequest.version,
			});

			res.status(201).send(liftRequest);
		} catch (error) {
			throw new BadRequestError("Lift request not created");
		}
	}
);

export { router as createLiftRequestRouter };
