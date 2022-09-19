import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

// importing models and services
import { User, UserDoc } from "../../models/user";

// importing error-types and middlewares
import {
	BadRequestError,
	currentUser,
	validateRequest,
} from "@kmalae.ltd/library";

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

		await User.findOneAndUpdate(
			{
				email: req.currentUser.email,
			},
			{
				email,
				firstName,
				lastName,
				IDNumber,
				dateOfBirth,
				phoneNumber,
			},
			{ upsert: false },
			function (err, doc) {
				if (err) throw new BadRequestError("User does not exist");

				const userJwt = jwt.sign(
					{
						id: doc!.id,
						email: doc!.email,
					},
					process.env.JWT_KEY!
				);

				req.session = {
					jwt: userJwt,
				};
			}
		)
			.clone()
			.catch(function (err) {
				console.log(err);
			});

		res.status(200).send({});
	}
);

export { router as updateInfoRouter };
