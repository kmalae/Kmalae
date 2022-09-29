import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';

// importing models and services
import { MatchRide } from '../models/match-ride';
import { User } from '../models/user';

// importing error-types and middlewares
import {
	BadRequestError,
	currentUser,
	validateRequest,
	NotAuthorizedError,
	natsWrapper,
	MatchRideStatus,
	WhoCancelled,
} from '@kmalae.ltd/library';

// importing event publishers and listeners
import { MatchRideCancelledPublisher } from '../events/publish/match-ride/match-ride-cancelled-publisher';

const router = express.Router();

router.delete(
	'/api/match/passengerCancelRequest',
	[
		body('matchRequestID')
			.notEmpty()
			.withMessage('Match ride ID must be provided')
			.custom((value) => mongoose.Types.ObjectId.isValid(value))
			.withMessage('Invalid match request ID'),
		body('passengerCurrentTime')
			.notEmpty()
			.withMessage('Passenger current time must be provided')
			.isISO8601()
			.withMessage('Incorrect passenger current time format')
			.exists()
			.withMessage('Passenger current time must be valid'),
	],
	currentUser,
	validateRequest,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new NotAuthorizedError();
		}

		let { matchRequestID, passengerCurrentTime } = req.body;

		const { id, email } = req.currentUser;
		const existingUser = await User.findOne({
			id,
			email,
		});

		if (!existingUser) {
			throw new BadRequestError('User does not exist');
		}

		const existingMatchRide = await MatchRide.findById(matchRequestID);

		if (!existingMatchRide) {
			throw new BadRequestError('Match request does not exist');
		}

		if (existingMatchRide.status !== MatchRideStatus.Confirmed) {
			throw new BadRequestError('Passenger cannot cancel');
		}

		passengerCurrentTime = new Date(passengerCurrentTime);
		const createdAtTime = new Date(existingMatchRide.createdAt);

		//@ts-ignore
		var diff = Math.abs(passengerCurrentTime - createdAtTime);
		var timeWindow = Math.floor(diff / 1000 / 60);

		if (timeWindow > 5) {
			throw new BadRequestError('Passenger cannot cancel');
		}

		existingMatchRide.set({
			status: MatchRideStatus.Cancelled,
			whoCancelled: WhoCancelled.Passenger,
		});

		try {
			await existingMatchRide.save();

			// publishing match ride cancelled data
			new MatchRideCancelledPublisher(natsWrapper.client).publish({
				id: existingMatchRide.id,
				whoCancelled: WhoCancelled.Passenger,
				version: existingMatchRide.version,
			});

			res.status(200).send(existingMatchRide);
		} catch (error) {
			throw new BadRequestError('Match request not cancelled');
		}
	}
);

export { router as passengerCancelledRequestRouter };
