import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { natsWrapper } from "@kmalae.ltd/library";

// importing models and service
import { Review } from "../models/review";
import { User } from "../models/user";
import { MatchRide } from "../models/match-ride";

// importing error-types, middle, and types
import {
	validateRequest,
	BadRequestError,
	NotAuthorizedError,
	currentUser,
} from "@kmalae.ltd/library";

// importing event publishers and listeners
import { ReviewUpdatedPublisher } from "../events/publish/review-updated-publisher";

const router = express.Router();

router.post(
	"/api/review/updateDriverReview",
	[
		body("passengerID")
			.custom((input: string) => {
				return mongoose.Types.ObjectId.isValid(input);
			})
			.withMessage("Invalid passenger ID"),
		body("matchRequestID")
			.custom((input: string) => {
				return mongoose.Types.ObjectId.isValid(input);
			})
			.withMessage("Invalid match request ID"),
		body("driverComment")
			.notEmpty()
			.withMessage("Driver comment must be provided"),
		body("driverRating")
			.notEmpty()
			.withMessage("Rating must be provided")
			.isNumeric()
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

		const { passengerID, matchRequestID, driverRating, driverComment } =
			req.body;

		const existingMatchRide = await MatchRide.findOne({
			id: matchRequestID,
			passenger: passengerID,
			driver: id,
		});

		if (!existingMatchRide) {
			throw new BadRequestError("Match ride does not exist");
		}

		const existingReview = await Review.findOne({
			passenger: passengerID,
			driver: id,
			matchRide: matchRequestID,
		});

		if (!existingReview) {
			throw new BadRequestError("Review does not exist");
		}

		existingReview.set({
			driverRated: driverRating,
			driverCommented: driverComment,
		});
		try {
			await existingReview.save();

			// publishing Review data
			new ReviewUpdatedPublisher(natsWrapper.client).publish({
				id: existingReview.id,
				passenger: existingReview.passenger,
				driver: existingReview.driver,
				matchRide: existingReview.matchRide,
				driverRated: existingReview.driverRated,
				driverCommented: existingReview.driverCommented,
				version: existingReview.version,
			});

			res.status(201).send(existingReview);
		} catch (error) {
			console.log(error);
			throw new BadRequestError("Review not updated");
		}
	}
);

export { router as UpdateDriverReviewtRouter };
