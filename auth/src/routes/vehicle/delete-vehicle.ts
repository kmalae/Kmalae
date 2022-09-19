import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

// importing models and services
import { Vehicle } from "../../models/vehicle";

// importing error-types and middlewares
import {
	BadRequestError,
	currentUser,
	validateRequest,
} from "@kmalae.ltd/library";

const router = express();

router.post(
	"/api/users/deleteVehicle",
	[
		body("vehicleID")
			.notEmpty()
			.withMessage("Vehicle ID must be provided")
			.custom((value) => mongoose.Types.ObjectId.isValid(value))
			.withMessage("Invalid vehicle ID"),
	],
	currentUser,
	validateRequest,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new BadRequestError("User not authenticated");
		}

		const { vehicleID } = req.body;

		const vehicle = await Vehicle.findById(vehicleID);
		if (!vehicle) {
			throw new BadRequestError("Vehicle does not exist");
		}

		await Vehicle.findByIdAndDelete(vehicle.id);
		res.send({});
	}
);

export { router as deleteVehicleRouter };
