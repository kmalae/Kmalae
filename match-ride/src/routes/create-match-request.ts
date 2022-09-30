import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { natsWrapper } from '@kmalae.ltd/library';

// importing models and service
import { MatchRide } from '../models/match-ride';

// importing error-types, middle, and types
import {
	LocationType,
	Location,
	validateRequest,
	BadRequestError,
	NotAuthorizedError,
	currentUser,
} from '@kmalae.ltd/library';

// importing event publishers and listeners
import { MatchRideCreatedPublisher } from '../events/publish/match-ride/match-ride-created-publisher';
import { User } from '../models/user';

const router = express.Router();

router.post(
	'/api/match/createMatchRequest',
	[
		body('passengerID')
			.custom((input: string) => {
				return mongoose.Types.ObjectId.isValid(input);
			})
			.withMessage('Invalid passenger ID'),
		body('driverID')
			.custom((input: string) => {
				return mongoose.Types.ObjectId.isValid(input);
			})
			.withMessage('Invalid driver ID'),

		body('rideRequestID')
			.custom((input: string) => {
				return mongoose.Types.ObjectId.isValid(input);
			})
			.withMessage('Invalid ride request ID'),
		body('vehicleID')
			.custom((input: string) => {
				return mongoose.Types.ObjectId.isValid(input);
			})
			.withMessage('Invalid vehicle ID'),
		body('destination')
			.custom((input: LocationType) => {
				return Location(input);
			})
			.withMessage('Invalid destination location'),
		body('timeOfDeparture')
			.notEmpty()
			.withMessage('Departure time must be provided')
			.isISO8601()
			.withMessage('Incorrect departure time format')
			.exists()
			.withMessage('Departure time must be valid'),
	],
	validateRequest,
	currentUser,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new NotAuthorizedError();
		}

		const {
			passengerID,
			driverID,
			rideRequestID,
			vehicleID,
			destination,
			timeOfDeparture,
		} = req.body;

		const { id, email } = req.currentUser;
		const existingUser = await User.findOne({
			id,
			email,
		});

		if (!existingUser) {
			throw new BadRequestError('User does not exist');
		}

		const matchRide = MatchRide.build({
			passenger: passengerID,
			driver: driverID,
			ride: rideRequestID,
			vehicle: vehicleID,
			destination,
			timeOfDeparture,
		});

		try {
			await matchRide.save();

			// publishing match ride data
			new MatchRideCreatedPublisher(natsWrapper.client).publish({
				id: matchRide.id,
				driver: driverID,
				passenger: passengerID,
				ride: rideRequestID,
				vehicle: vehicleID,
				destination,
				timeOfDeparture,
				createdAt: matchRide.createdAt,
				version: matchRide.version,
			});

			res.status(201).send(matchRide);
		} catch (error) {
			console.log(error);
			throw new BadRequestError('Match ride not created');
		}
	}
);

export { router as createMatchRequestRouter };
