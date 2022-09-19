import express, { Request, Response } from "express";

// importing models and services
import { Vehicle } from "../../models/vehicle";

// importing error-types and middlewares
import { BadRequestError, currentUser } from "@kmalae.ltd/library";

const router = express.Router();

router.get(
	"/api/users/getUserVehicles",
	currentUser,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new BadRequestError("User not authenticated");
		}

		const { id, email } = req.currentUser;
		const vehicles = await Vehicle.find({ user: id });

		res.status(200).send(vehicles);
	}
);

export { router as getUserVehiclesRouter };
