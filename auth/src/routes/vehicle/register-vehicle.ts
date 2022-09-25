import express, { NextFunction, Request, Response } from "express";
import { body, check } from "express-validator";
import multer from "multer";
import fs from "fs";
import path from "path";
import { natsWrapper } from "../../nats-wrapper";

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
import { VehicleRegisteredPublisher } from "../../events/publish/vehicle/vehicle-registered-publisher";

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
	"/api/users/registerVehicle",
	upload.single("carImage"),
	[
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

		const { carBrand, carModel, MPG } = req.body;
		const carImage = req.file;
		const imageFormat = carImage!.mimetype;
		const carImageBuffer = fs.readFileSync(
			path.join("uploads/" + carImage!.filename)
		) as Buffer;

		const existingUser = await User.findOne({ id: req.currentUser.id });
		if (!existingUser) {
			throw new BadRequestError("User does not exist");
		}

		const newVehicle = Vehicle.build({
			carBrand,
			carModel,
			MPG,
			carImage: {
				data: carImageBuffer,
				contentType: imageFormat,
			},
			user: existingUser,
		});
		try {
			await newVehicle.save();

			//publishing vehicle data
			new VehicleRegisteredPublisher(natsWrapper.client).publish({
				id: newVehicle.id,
				carBrand: newVehicle.carBrand,
				carModel: newVehicle.carModel,
				user: existingUser.id,
				MPG: newVehicle.MPG,
				carImage: {
					data: newVehicle.carImage.data,
					contentType: newVehicle.carImage.contentType,
				},
				version: newVehicle.version,
			});
			res.status(200).send(newVehicle);
		} catch (error) {
			throw new BadRequestError("Vehicle not registered");
		}
	}
);

export { router as registerVehicleRouter };
