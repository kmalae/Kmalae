import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import multer from "multer";
import fs from "fs";
import path from "path";
import { natsWrapper } from "@kmalae.ltd/library";

// importing models and services
import { User } from "../../models/user";
import { Vehicle } from "../../models/vehicle";

// importing error-types and middlewares
import {
	BadRequestError,
	currentUser,
	validateRequest,
} from "@kmalae.ltd/library";

// importing event publishers and listeners
import { VehicleUpdatedPublisher } from "../../events/publish/vehicle/vehicle-updated-publisher";

import mongoose from "mongoose";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const validateImage = (req: Request, res: Response, next: NextFunction) => {
	if (!req.file) {
		throw new BadRequestError("Image must be provided 1");
	}

	if (req.file.mimetype.split("/")[0].toLowerCase() !== "image")
		throw new BadRequestError("Image must be provided 2");

	const imageFile = req.file;
	const acceptedImageFormat = ["jpeg", "jpg", "png"];
	const fileExtension = imageFile.mimetype.split("/").pop()!.toLowerCase();
	if (!acceptedImageFormat.includes(fileExtension!)) {
		throw new BadRequestError("Invalid image format");
	}

	next();
};

router.post(
	"/api/users/updateVehicle",
	upload.single("carImage"),
	[
		body("vehicleID")
			.custom((input: string) => {
				return mongoose.Types.ObjectId.isValid(input);
			})
			.withMessage("Invalid vehicle ID"),
		body("carBrand").notEmpty().withMessage("Car brand must be provided"),
		body("carModel").notEmpty().withMessage("Car model must be provided"),
		body("MPG")
			.notEmpty()
			.withMessage("MPG must be provided")
			.isNumeric()
			.withMessage("MPG must be numeric"),
	],
	currentUser,
	validateRequest,
	validateImage,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new BadRequestError("User not authenticated");
		}

		const existingUser = await User.findOne({ id: req.currentUser.id });
		if (!existingUser) {
			throw new BadRequestError("User does not exist");
		}

		const { vehicleID, carBrand, carModel, MPG } = req.body;

		const carImage = req.file;
		const imageFormat = carImage!.mimetype;
		const carImageBuffer = fs.readFileSync(
			path.join("uploads/" + carImage!.filename)
		) as Buffer;

		const existingVehicle = await Vehicle.findById(vehicleID);
		if (!existingVehicle) throw new BadRequestError("Vehicle does not exist");

		existingVehicle.set({
			carBrand,
			carModel,
			MPG,
			carImage: {
				data: carImageBuffer,
				contentType: imageFormat,
			},
		});

		try {
			await existingVehicle.save();

			// publishing udpated vehicle data
			new VehicleUpdatedPublisher(natsWrapper.client).publish({
				id: existingVehicle.id,
				carBrand: existingVehicle.carBrand,
				carModel: existingVehicle.carModel,
				MPG: existingVehicle.MPG,
				user: existingUser.id,
				carImage: {
					data: existingVehicle.carImage.data,
					contentType: existingVehicle.carImage.contentType,
				},
				version: existingVehicle.version,
			});

			res.status(200).send(existingVehicle);
		} catch (error) {
			throw new BadRequestError("Vehicle not updated");
		}
	}
);

export { router as updateVehicleRouter };
