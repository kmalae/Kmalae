import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { natsWrapper } from "@kmalae.ltd/library";

// importing models and service
import { Review } from "../models/review";
import { MatchRide } from "../models/match-ride";
import { User } from "../models/user";

// importing error-types, middle, and types
import {
	validateRequest,
	BadRequestError,
	NotAuthorizedError,
	currentUser,
} from "@kmalae.ltd/library";

// importing event publishers
import { ReviewUpdatedPublisher } from "../events/publish/review-updated-publisher";

const router = express.Router();

router.post(
	"/api/review/updatePassengerReview",
	[
		body("driverID")
			.custom((input: string) => {
				return mongoose.Types.ObjectId.isValid(input);
			})
			.withMessage("Invalid driver ID"),
		body("matchRequestID")
			.custom((input: string) => {
				return mongoose.Types.ObjectId.isValid(input);
			})
			.withMessage("Invalid match request ID"),
		body("passengerComment")
			.notEmpty()
			.withMessage("Passenger comment must be provided"),
		body("passengerRating")
			.notEmpty()
			.withMessage("Rating must be provided")
			.isNumeric()
			.not()
			.isDecimal()
			.withMessage("Rating must be number")
			.custom((input: number) => {
				return input <= 5 && input >= 0;
			})
			.exists()
			.withMessage("Rating must be valid"),
	],
	validateRequest,
	currentUser,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new NotAuthorizedError();
		}

		const { id, email } = req.currentUser;
		const existingPassenger = await User.findOne({
			id,
			email,
		});

		if (!existingPassenger) {
			throw new BadRequestError("Passenger does not exist");
		}

		const { driverID, matchRequestID, passengerComment, passengerRating } =
			req.body;

		const existingDriver = await User.findById(driverID);

		if (!existingDriver) {
			throw new BadRequestError("Driver does not exist");
		}

		const existingMatchRide = await MatchRide.findOne({
			id: matchRequestID,
			passenger: existingPassenger.id,
			driver: existingDriver.id,
		});

		if (!existingMatchRide) {
			throw new BadRequestError("Match ride does not exist");
		}

		const existingReview = await Review.findOne({
			passenger: existingPassenger.id,
			driver: existingDriver.id,
			matchRide: matchRequestID,
		});

		if (!existingReview) {
			throw new BadRequestError("Review does not exist");
		}

		existingReview.set({
			passengerRated: passengerRating,
			passengerCommented: passengerComment,
		});

		try {
			await existingReview.save();

			// publishing Review data
			new ReviewUpdatedPublisher(natsWrapper.client).publish({
				id: existingReview.id,
				passenger: existingReview.passenger,
				driver: existingReview.driver,
				matchRide: existingReview.matchRide,
				passengerRated: existingReview.passengerRated,
				passengerCommented: existingReview.passengerCommented,
				version: existingReview.version,
			});

			res.status(201).send(existingReview);
		} catch (error) {
			console.log(error);
			throw new BadRequestError("Review not updated");
		}
	}
);

export { router as updatePassengerReviewtRouter };
