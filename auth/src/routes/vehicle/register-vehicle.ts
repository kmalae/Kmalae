import express, { NextFunction, Request, Response } from "express";
import { body, check } from "express-validator";
import multer from "multer";
import fs from "fs";
import path from "path";

// importing models and services
import { User } from "../../models/user";
import { Vehicle } from "../../models/vehicle";

// importing error-types and middlewares
import {
	BadRequestError,
	currentUser,
	validateRequest,
} from "@kmalae.ltd/library";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const validateImage = (req: Request, res: Response, next: NextFunction) => {
	if (!req.file) {
		throw new BadRequestError("Image must be provided 1");
	}

	console.log(req.file.mimetype);

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

let imageNotProvided = false;

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

		newVehicle.save();

		res.status(200).send(newVehicle);
	}
);

export { router as registerVehicleRouter };
