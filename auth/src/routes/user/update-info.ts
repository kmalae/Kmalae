import express, { Request, Response } from "express";
import { body } from "express-validator";
import { natsWrapper } from "@kmalae.ltd/library";
import jwt from "jsonwebtoken";

// importing models and services
import { User } from "../../models/user";

// importing error-types and middlewares
import {
	BadRequestError,
	currentUser,
	validateRequest,
} from "@kmalae.ltd/library";

// importing event publishers and listeners
import { UserUpdatedPublisher } from "../../events/publish/user/user-updated-publisher";

const router = express.Router();

router.post(
	"/api/users/updateInfo",
	[
		body("email")
			.notEmpty()
			.withMessage("Email must be provided")
			.isEmail()
			.withMessage("Email must be valid"),
		body("firstName")
			.notEmpty()
			.withMessage("First name must be provided")
			.isAlphanumeric()
			.withMessage("First name cannot contain a digit"),
		body("lastName")
			.notEmpty()
			.withMessage("Last name must be provided")
			.isAlphanumeric()
			.withMessage("Last name cannot contain a digit"),
		body("IDNumber")
			.notEmpty()
			.withMessage("ID number must be provided")
			.isNumeric()
			.isLength({ min: 8, max: 8 })
			.withMessage("ID number must be valid"),
		body("dateOfBirth")
			.notEmpty()
			.withMessage("Date of birth must be provided")
			.isISO8601()
			.withMessage("Incorrect date format")
			.exists()
			.isDate()
			.withMessage("Date of birth must be valid"),
		body("phoneNumber")
			.notEmpty()
			.withMessage("Phone number must be provided")
			.isMobilePhone("ar-AE")
			.withMessage("Invalid phone number"),
	],
	currentUser,
	validateRequest,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new BadRequestError("User not authenticated");
		}

		const { email, firstName, lastName, IDNumber, dateOfBirth, phoneNumber } =
			req.body;

		const existingUser = await User.findById(req.currentUser.id);
		if (!existingUser) throw new BadRequestError("User does not exist");

		existingUser.set({
			email,
			firstName,
			lastName,
			IDNumber,
			dateOfBirth,
			phoneNumber,
		});

		try {
			await existingUser.save();

			// Generate JWT
			const userJwt = jwt.sign(
				{
					id: existingUser.id,
					email: existingUser.email,
				},
				process.env.JWT_KEY!
			);

			// Store JWT on session object
			req.session = {
				jwt: userJwt,
			};

			//publishing user data
			new UserUpdatedPublisher(natsWrapper.client).publish({
				id: existingUser.id,
				email: existingUser.email,
				version: existingUser.version,
			});

			return res.status(201).send(existingUser);
		} catch (error) {
			throw new BadRequestError("User not updated");
		}
	}
);

export { router as updateInfoRouter };
