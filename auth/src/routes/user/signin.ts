import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

// importing Models and Services
import { User } from "../../models/user";
import { Password } from "../../services/password";

// importing error-types and middlewares
import { BadRequestError, validateRequest } from "@kmalae.ltd/library";

const router = express.Router();

router.post(
	"/api/users/signin",
	[
		body("email")
			.notEmpty()
			.withMessage("Email must be provided")
			.isEmail()
			.withMessage("Email is invalid"),
		body("password").notEmpty().withMessage("Password must be provided"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;
		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			throw new BadRequestError("Incorrect credentials");
		}

		const passwordsMatch = await Password.compare(
			existingUser.password,
			password
		);

		if (!passwordsMatch) {
			throw new BadRequestError("Incorrect credentials");
		}

		const userJwt = jwt.sign(
			{
				id: existingUser.id,
				email: existingUser.email,
			},
			process.env.JWT_KEY!
		);

		req.session = {
			jwt: userJwt,
		};

		res.status(200).send(existingUser);
	}
);

export { router as signinRouter };
