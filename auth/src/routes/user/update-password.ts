import express, { Request, Response } from "express";
import { body } from "express-validator";

// importing models and services
import { User } from "../../models/user";

// importing error-types and middlewares
import {
	BadRequestError,
	currentUser,
	validateRequest,
} from "@kmalae.ltd/library";
import { Password } from "../../services/password";

interface UserPaylod {
	id: string;
	email: string;
}

const router = express.Router();

router.post(
	"/api/users/updatePassword",
	[
		body("oldPassword")
			.notEmpty()
			.withMessage("Old password must be provided"),
		body("newPassword")
			.notEmpty()
			.withMessage("Password must be provided")
			.isLength({ min: 4, max: 20 })
			.withMessage("Password must be between 4 and 20 characters long"),
	],
	validateRequest,
	currentUser,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new BadRequestError("User not authenticated");
		}

		const { oldPassword, newPassword } = req.body;
		const { id, email } = req.currentUser;

		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			throw new BadRequestError("User does not exist");
		}

		if (!(await Password.compare(existingUser.password, oldPassword))) {
			throw new BadRequestError("Incorrect credential");
		}

		existingUser.password = newPassword;
		existingUser.passwordLastUpdatedAt = new Date();
		existingUser.save();

		res.status(200).send(existingUser);
	}
);

export { router as updatePasswordRouter };
