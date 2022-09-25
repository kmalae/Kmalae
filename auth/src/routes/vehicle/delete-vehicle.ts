import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { natsWrapper } from "@kmalae.ltd/library";

// importing models and services
import { User } from "../../models/user";
import { Vehicle } from "../../models/vehicle";

// importing error-types and middlewares
import {
	BadRequestError,
	currentUser,
	validateRequest,
	VehicleStatus,
} from "@kmalae.ltd/library";

// importing event publishers and listeners
import { VehicleDeletedPublisher } from "../../events/publish/vehicle/vehicle-deleted-publisher";

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

		const existingUser = await User.findOne({ id: req.currentUser.id });
		if (!existingUser) {
			throw new BadRequestError("User does not exist");
		}

		const existingVehicle = await Vehicle.findById(vehicleID);
		if (!existingVehicle) {
			throw new BadRequestError("Vehicle does not exist");
		}

		existingVehicle.set({
			status: VehicleStatus.Deleted,
		});

		try {
			await existingVehicle.save();
			new VehicleDeletedPublisher(natsWrapper.client).publish({
				id: existingVehicle.id,
				user: existingUser.id,
				version: existingVehicle.version,
			});

			res.status(200).send({});
		} catch (error) {
			throw new BadRequestError("Vehicle not Deleted");
		}
	}
);

export { router as deleteVehicleRouter };
