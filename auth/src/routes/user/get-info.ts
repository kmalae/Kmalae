import express, { Request, Response } from "express";

// importing models and services
import { User } from "../../models/user";

// importing error-types and middlewares
import { BadRequestError, currentUser } from "@kmalae.ltd/library";

const router = express.Router();

router.get(
	"/api/users/getInfo",
	currentUser,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new BadRequestError("User not authenticated");
		}

		const { id, email } = req.currentUser;

		const user = await User.findOne({ id, email });
		res.status(200).send(user);
	}
);

export { router as getInfoRouter };
