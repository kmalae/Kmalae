import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

// importing models and services
import { MatchRide } from "../models/match-ride";
import { User } from "../models/user";

// importing error-types and middlewares
import {
	BadRequestError,
	currentUser,
	validateRequest,
	NotAuthorizedError,
	MatchRideStatus,
	natsWrapper,
} from "@kmalae.ltd/library";

// importing event publishers and listeners
import { MatchRideConfirmedPublisher } from "../events/publish/match-ride/match-ride-confirmed-publisher";

const router = express.Router();

router.post(
	"/api/match/confirmMatchRequest",
	[
		body("matchRequestID")
			.notEmpty()
			.withMessage("match ride ID must be provided")
			.custom((value) => mongoose.Types.ObjectId.isValid(value))
			.withMessage("Invalid match ride request ID"),
	],
	currentUser,
	validateRequest,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new NotAuthorizedError();
		}
		const { matchRequestID } = req.body;

		const { id, email } = req.currentUser;
		const existingUser = await User.findOne({
			id,
			email,
		});

		if (!existingUser) {
			throw new BadRequestError("User does not exist");
		}

		const existingMatchRide = await MatchRide.findOne({
			id: matchRequestID,
			passenger: existingUser.id,
		});
		if (!existingMatchRide) {
			throw new BadRequestError("Match ride does not exist");
		}

		if (existingMatchRide.status !== MatchRideStatus.Requested) {
			throw new BadRequestError("Passenger cannot confirm");
		}

		existingMatchRide.set({
			status: MatchRideStatus.Confirmed,
		});

		try {
			await existingMatchRide.save();

			// publishing ride request confirmed data
			new MatchRideConfirmedPublisher(natsWrapper.client).publish({
				id: existingMatchRide.id,
				version: existingMatchRide.version,
			});

			res.status(200).send(existingMatchRide);
		} catch (error) {
			throw new BadRequestError("Matched Ride not confirmed");
		}
	}
);

export { router as confirmMatchRequestRouter };
