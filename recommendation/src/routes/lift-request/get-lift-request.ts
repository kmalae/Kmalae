import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

// importing models and services
import { LiftRequest } from "../../models/lift-request";
import { User } from "../../models/user";

// importing error-types and middlewares
import {
	BadRequestError,
	currentUser,
	NotAuthorizedError,
	validateRequest,
} from "@kmalae.ltd/library";


const router = express.Router();

router.post(
	"/api/recomm/getLiftRequest",
	[
		body("liftRequestID")
			.custom((input: string) => {
				return mongoose.Types.ObjectId.isValid(input);
			})
			.withMessage("Invalid lift request ID"),
	],
	currentUser,
	validateRequest,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new NotAuthorizedError();
		}

		const { liftRequestID } = req.body;
    const { id, email } = req.currentUser;
		const existingUser = await User.findOne({
			id,
			email,
		});

		if (!existingUser) {
			throw new BadRequestError("User does not exist");
		}

		const existingLiftRequest = await LiftRequest.findById(liftRequestID);
		if (!existingLiftRequest) {
			throw new BadRequestError("Lift request does not exist");
		}

		res.status(200).send(existingLiftRequest);
	}
);

export { router as getLiftRequestRouter };
