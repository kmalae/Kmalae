import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

// importing models and services
import { Vehicle } from "../../models/vehicle";

// importing error-types and middlewares
import { BadRequestError, validateRequest } from "@kmalae.ltd/library";

const router = express.Router();

router.post(
	"/api/recomm/getDriverVehicle",
	[
		body("vehicleID")
			.notEmpty()
			.withMessage("Vehicle ID must be provided")
			.custom((value) => mongoose.Types.ObjectId.isValid(value))
			.withMessage("Invalid vehicle ID"),
		body("userID")
			.notEmpty()
			.withMessage("User ID must be provided")
			.custom((value) => mongoose.Types.ObjectId.isValid(value))
			.withMessage("Invalid user ID"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { vehicleID, userID } = req.body;

		const existingVehicle = await Vehicle.findOne({
			vehicle: vehicleID,
			user: userID,
		});

		if (!existingVehicle) {
			throw new BadRequestError("Vehicle does not exist");
		}

		res.status(200).send(existingVehicle);
	}
);

export { router as getDriverVehicleRouter };
