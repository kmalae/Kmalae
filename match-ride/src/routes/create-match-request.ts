import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { natsWrapper } from "@kmalae.ltd/library";

// importing models and service
import { MatchRide } from "../models/match-ride";
import { User } from "../models/user";
import { RideRequest } from "../models/ride-request";
import { LiftRequest } from "../models/lift-request";
import { Vehicle } from "../models/vehicle";

// importing error-types, middle, and types
import {
	LocationType,
	Location,
	validateRequest,
	BadRequestError,
	NotAuthorizedError,
	currentUser,
} from "@kmalae.ltd/library";

// importing event publishers and listeners
import { MatchRideCreatedPublisher } from "../events/publish/match-ride/match-ride-created-publisher";

const router = express.Router();

router.post(
	"/api/match/createMatchRequest",
	[
		body("passengerID")
			.custom((input: string) => {
				return mongoose.Types.ObjectId.isValid(input);
			})
			.withMessage("Invalid passenger ID"),
		body("rideRequestID")
			.custom((input: string) => {
				return mongoose.Types.ObjectId.isValid(input);
			})
			.withMessage("Invalid ride request ID"),
		body("liftRequestID")
			.custom((input: string) => {
				return mongoose.Types.ObjectId.isValid(input);
			})
			.withMessage("Invalid lift request ID"),
		body("vehicleID")
			.custom((input: string) => {
				return mongoose.Types.ObjectId.isValid(input);
			})
			.withMessage("Invalid vehicle ID"),
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
	validateRequest,
	currentUser,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new NotAuthorizedError();
		}

		const { id, email } = req.currentUser;
		const {
			passengerID,
			rideRequestID,
			liftRequestID,
			vehicleID,
			destination,
			timeOfDeparture,
		} = req.body;

		const existingDriver = await User.findById(id);
		if (!existingDriver) {
			throw new BadRequestError("Driver does not exist");
		}

		const existingVehicle = await Vehicle.findOne({
			id: vehicleID,
			user: existingDriver.id,
		});
		if (!existingVehicle) {
			throw new BadRequestError("Vehicle does not exist");
		}

		const existingPassenger = await User.findById(passengerID);
		if (!existingPassenger) {
			throw new BadRequestError("Passener does not exist");
		}

		const existingRideRequest = await RideRequest.findOne({
			id: rideRequestID,
			user: existingPassenger.id,
		});
		if (!existingRideRequest) {
			throw new BadRequestError("Ride request does not exist");
		}

		const existingLiftRequest = await LiftRequest.findOne({
			id: liftRequestID,
			user: existingDriver.id,
		});
		if (!existingLiftRequest) {
			throw new BadRequestError("Lift request does not exist");
		}

		const matchRide = MatchRide.build({
			passenger: existingPassenger.id,
			driver: existingDriver.id,
			rideRequest: existingRideRequest.id,
			liftRequest: existingLiftRequest.id,
			vehicle: existingVehicle.id,
			destination,
			timeOfDeparture,
		});

		try {
			await matchRide.save();

			// publishing match ride data
			new MatchRideCreatedPublisher(natsWrapper.client).publish({
				id: matchRide.id,
				driver: existingDriver.id,
				passenger: existingPassenger.id,
				createdAt: matchRide.createdAt,
				version: matchRide.version,
			});

			res.status(201).send(matchRide);
		} catch (error) {
			console.log(error);
			throw new BadRequestError("Match ride not created");
		}
	}
);

export { router as createMatchRequestRouter };
