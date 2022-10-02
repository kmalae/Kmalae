import express, { Request, Response } from "express";
import { body } from "express-validator";

// importing model and services
import { RideRequest } from "../../models/ride-request";

// importing error-types, middlewards and types
import {
	LocationType,
	Location,
	validateRequest,
	currentUser,
} from "@kmalae.ltd/library";

const router = express.Router();

router.post(
	"/api/recomm/getMutualRequests",
	[
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
		body("acceptableRadius")
			.notEmpty()
			.withMessage("Radius must be provided")
			.isNumeric()
			.withMessage("Invalid radius"),
	],
	validateRequest,
	currentUser,
	async (req: Request, res: Response) => {
		let { destination, timeOfDeparture, acceptableRadius } = req.body;

		timeOfDeparture = new Date(timeOfDeparture);
		const potentialPassengers = await RideRequest.getAcceptableCoordinates(
			destination,
			acceptableRadius,
			timeOfDeparture
		);

		res.send(potentialPassengers);
	}
);

export { router as getMutualRequestsRouter };
