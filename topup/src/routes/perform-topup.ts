import express, { Request, Response } from "express";
import { body } from "express-validator";
import { stripe } from "./../stripe";

// importing models and services
import { User } from "../models/user";
import { Topup } from "../models/topup";

// importing error-types, middlewares and types
import {
	BadRequestError,
	currentUser,
	natsWrapper,
	NotAuthorizedError,
	TopupHistory,
	validateRequest,
} from "@kmalae.ltd/library";

// importing event publishers
import { TopupPerformedPublisher } from "../events/publish/topup-performed-publisher";

const router = express.Router();

router.post(
	"/api/topup/performTopup",
	[
		body("token").not().isEmpty().withMessage("Token should be provided"),
		body("amount")
			.notEmpty()
			.withMessage("Amout must be provided")
			.isNumeric()
			.withMessage("Amout must be a number"),
	],
	validateRequest,
	currentUser,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new NotAuthorizedError();
		}

		const { id, email } = req.currentUser!;

		const existingUser = await User.findOne({
			id,
			email,
		});

		if (!existingUser) {
			throw new BadRequestError("User does not exist");
		}

		const { token, amount } = req.body;

		const charge = await stripe.charges.create({
			currency: "aed",
			amount: amount * 100,
			source: token,
		});

		const topupPerformed: TopupHistory = {
			stripeID: charge.id,
			amount: charge.amount,
			toppedAt: new Date(),
			cardUsed: {
				nameOnCard: charge.billing_details.name,
				cardNumber: charge.payment_method_details!.card!.last4,
				expires: new Date(
					`${charge.payment_method_details?.card?.exp_year}/${charge.payment_method_details?.card?.exp_month}`
				),
			},
		};

		const existingTopup = await Topup.findOne({ user: existingUser.id });
		if (existingTopup) {
			const totalPoints = existingTopup.points + charge.amount;

			existingTopup.TopupsPerfomed.push(topupPerformed);
			existingTopup.points = totalPoints;

			try {
				await existingTopup.save();

				// publishing Topup data
				new TopupPerformedPublisher(natsWrapper.client).publish({
					id: existingTopup.id,
					user: existingTopup.user,
					points: existingTopup.points,
					version: existingTopup.version,
				});

				res.status(200).send(existingTopup);
			} catch (error) {
				throw new BadRequestError("Topup not peformed");
			}
		} else {
			const topupsPerformedArray = Array();
			topupsPerformedArray[0] = topupPerformed;
			const topup = Topup.build({
				user: existingUser.id,
				points: charge.amount,
				TopupsPerfomed: topupsPerformedArray,
			});

			try {
				await topup.save();

				// publishing Topup data
				new TopupPerformedPublisher(natsWrapper.client).publish({
					id: topup.id,
					user: topup.user,
					points: topup.points,
					version: topup.version,
				});

				res.status(200).send(topup);
			} catch (error) {
				throw new BadRequestError("Topup not performed");
			}
		}
	}
);

export { router as performTopupRouter };
