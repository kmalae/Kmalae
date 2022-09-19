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

const router = express.Router();

router.post(
	"/api/users/getVehicleInfo",
	[
		body("vehicleID").custom((input: string) => {
			return mongoose.Types.ObjectId.isValid(input);
		}),
	],
	currentUser,
	validateRequest,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new BadRequestError("User not authenticated");
		}
		const { vehicleID } = req.body;
		const { id, email } = req.currentUser;

		const vehicle = await Vehicle.findById(vehicleID);
		if (!vehicle) {
			throw new BadRequestError("Vehicle does not exist");
		}

		res.status(200).send(vehicle);
	}
);

export { router as getVehicleInfoRouter };
