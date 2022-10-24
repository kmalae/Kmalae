import express, { Request, Response } from "express";

// importing models and services
import { Review } from "../models/review";

// importing error-types and middlewares
import { BadRequestError, currentUser } from "@kmalae.ltd/library";

const router = express.Router();

router.get(
	"/api/review/getUserReviews",
	currentUser,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new BadRequestError("User not authenticated");
		}

		const { id, email } = req.currentUser;
		const existingReview = await Review.find({ user: id });

		res.status(200).send(existingReview);
	}
);

export { router as getUserVehiclesRouter };
