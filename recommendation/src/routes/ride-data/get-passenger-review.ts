import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

// importing models and services
import { User } from "../../models/user";
import { Review } from "../../models/review";

// importing error-types and middlewares
import { BadRequestError, validateRequest } from "@kmalae.ltd/library";

const router = express.Router();

router.post(
	"/api/recomm/getPassengerReview",
	[
		body("passengerID")
			.notEmpty()
			.withMessage("Passenger ID must be provided")
			.custom((value) => mongoose.Types.ObjectId.isValid(value))
			.withMessage("Invalid passenger ID"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { passengerID } = req.body;

		const existingPassenger = await User.findById(passengerID);
		if (!existingPassenger) {
			throw new BadRequestError("Passenger does not exist");
		}

		let totalRating = 0;
		let counter = 0;

		const passengerReview = await Review.find({ passenger: passengerID });
		if (!passengerReview) {
			return res.status(200).send(0);
		}

		passengerReview.map(({ driverRated }) => {
			if (driverRated !== null) {
				totalRating += driverRated;
				counter++;
			}
		});

		res.status(200).send(totalRating / counter);
	}
);

export { router as getPassengerReviewRouter };
