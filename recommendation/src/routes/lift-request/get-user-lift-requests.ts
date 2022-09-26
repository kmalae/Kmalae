import express, { Request, Response } from "express";

// importing models and services
import { LiftRequest } from "../../models/lift-request";
import { User } from "../../models/user";

// importing error-types and middlewares
import { BadRequestError, currentUser, NotAuthorizedError } from "@kmalae.ltd/library";

const router = express.Router();

router.get(
	"/api/recomm/getUserLiftRequests",
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

		
		const liftRequests = await LiftRequest.find({ user: id });

		res.status(200).send(liftRequests);
	}
);

export { router as getUserLiftRequestsRouter };
