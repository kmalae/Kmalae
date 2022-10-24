import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

// importing models and services
import { Payment } from "../models/payment";
import { User } from "../models/user";
import { Topup } from "../models/topup";
import { MatchRide } from "../models/match-ride";

// importing error-types, middlewares and types
import {
	BadRequestError,
	currentUser,
	MatchRideStatus,
	natsWrapper,
	NotAuthorizedError,
	validateRequest,
} from "@kmalae.ltd/library";

// importing event publishers
import { PaymentPointsDeductedPublisher } from "../events/publish/payment-points-deducted-publisher";
const router = express.Router();

router.post(
	"/api/payment/deductPoints",
	[
		body("driverID")
			.custom((input: string) => {
				return mongoose.Types.ObjectId.isValid(input);
			})
			.withMessage("Invalid driver ID"),

		body("matchRequestID")
			.custom((input: string) => {
				return mongoose.Types.ObjectId.isValid(input);
			})
			.withMessage("Invalid match request ID"),
		body("amountPaid")
			.notEmpty()
			.withMessage("Amount paid must be provided")
			.isNumeric()
			.withMessage("Amount paid must be a number"),
	],
	validateRequest,
	currentUser,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new NotAuthorizedError();
		}

		const { id, email } = req.currentUser!;

		const existingPassenger = await User.findOne({
			id,
			email,
		});

		if (!existingPassenger) {
			throw new BadRequestError("Passenger does not exist");
		}

		const { driverID, matchRequestID, amountPaid } = req.body;

		const existingDriver = await User.findById(driverID);
		if (!existingDriver) {
			throw new BadRequestError("Driver does not exist");
		}

		const existingMatchRide = await MatchRide.findOne({
			id: matchRequestID,
			passenger: existingPassenger.id,
			driver: existingDriver.id,
			status: MatchRideStatus.Confirmed,
		});
		if (!existingMatchRide) {
			throw new BadRequestError("Match ride does not exist");
		}

		const existingPassengerTopup = await Topup.findOne({
			user: existingPassenger.id,
		});
		if (!existingPassengerTopup) {
			throw new BadRequestError("Passenger topup does not exist");
		}

		const existingDriverTopup = await Topup.findOne({
			user: existingDriver.id,
		});
		if (!existingDriverTopup) {
			throw new BadRequestError("Driver topup does not exist");
		}

		existingPassengerTopup.points =
			existingPassengerTopup.points - parseInt(amountPaid);
		existingDriverTopup.points =
			existingDriverTopup.points + parseInt(amountPaid);

		console.log("type of amountPaid = " + amountPaid);
		console.log(
			"type of driverTopup.points = " + typeof existingDriverTopup.points
		);
		console.log(
			"type of passengerTopup.points = " +
				typeof existingPassengerTopup.points
		);

		const payment = Payment.build({
			passenger: existingPassenger.id,
			driver: existingDriver.id,
			matchRide: existingMatchRide.id,
			amountPaid,
			datePaid: new Date(),
		});

		existingMatchRide.status = MatchRideStatus.Paid;

		try {
			await payment.save();
			await existingPassengerTopup.save();
			await existingDriverTopup.save();
			await existingMatchRide.save();

			// publishing Topup data
			new PaymentPointsDeductedPublisher(natsWrapper.client).publish({
				passenger: existingPassenger.id,
				driver: existingDriver.id,
				matchRide: existingMatchRide.id,
				amountPaid,
				passengerTopupVersion: existingPassengerTopup.version,
				driverTopupVersion: existingDriverTopup.version,
				matchRideVersion: existingMatchRide.version,
			});

			res.status(200).send(payment);
		} catch (error) {
			throw new BadRequestError("Payment not performed");
		}
	}
);

export { router as deductPointsRouter };
