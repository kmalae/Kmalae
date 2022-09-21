import express, { Request, Response } from "express";

// importing models and services
import { RideRequest } from "../models/ride-request";
import { User } from "../models/user";

// importing error-types and middlewares
import { BadRequestError, currentUser, NotAuthorizedError } from "@kmalae.ltd/library";

const router = express.Router();

router.get(
	"/api/rides/getUserRideRequests",
	currentUser,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new NotAuthorizedError();
		}
		
		const { id, email } = req.currentUser;
		const existingUser = await User.findOne({
			id,
			email,
		});

		if (!existingUser) {
			throw new BadRequestError("User does not exist");
		}

		
		const rideRequests = await RideRequest.find({ user: id });

		res.status(200).send(rideRequests);
	}
);

export { router as getUserRideRequestsRouter };
