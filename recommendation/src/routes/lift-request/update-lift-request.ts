import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';

// importing models and services
import { LiftRequest } from '../../models/lift-request';
import { Vehicle } from '../../models/vehicle';
import { User } from '../../models/user';

// importing error-types and middlewares
import {
	BadRequestError,
	currentUser,
	validateRequest,
	LiftRequestStatus,
	LocationType,
	Location,
	NotAuthorizedError,
	natsWrapper,
} from '@kmalae.ltd/library';

// importing event publishers and listeners
import { LiftRequestUpdatedPublisher } from '../../events/publish/lift-request/lift-request-updated-publisher';

const router = express.Router();

router.post(
	'/api/recomm/updateLiftRequest',
	[
		body('liftRequestID')
			.custom((input: string) => {
				return mongoose.Types.ObjectId.isValid(input);
			})
			.withMessage('Invalid lift request ID'),
		body('vehicleID')
			.custom((input: string) => {
				return mongoose.Types.ObjectId.isValid(input);
			})
			.withMessage('Invalid vehicle ID'),
		body('currentLocation')
			.custom((input: LocationType) => {
				return Location(input);
			})
			.withMessage('Invalid pick up location')
			.notEmpty()
			.withMessage('Pick up location must be provided'),
		body('destination')
			.custom((input: LocationType) => {
				return Location(input);
			})
			.withMessage('Invalid destination location')
			.notEmpty()
			.withMessage('Destination location must be provided'),
		body('timeOfDeparture')
			.notEmpty()
			.withMessage('Departure time must be provided')
			.isISO8601()
			.withMessage('Incorrect departure time format')
			.exists()
			.isDate()
			.withMessage('Departure time must be valid'),
	],
	currentUser,
	validateRequest,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new NotAuthorizedError();
		}

		const {
			liftRequestID,
			vehicleID,
			currentLocation,
			destination,
			timeOfDeparture,
		} = req.body;
		const { id, email } = req.currentUser;
		const existingUser = await User.findOne({
			id,
			email,
		});

		let existingLiftRequest = await LiftRequest.findById(liftRequestID);
		if (!existingLiftRequest)
			throw new BadRequestError('Lift request does not exist');

		if (!existingUser) {
			throw new BadRequestError('User does not exist');
		}

		const existingVehicle = await Vehicle.findById(vehicleID);

		if (!existingVehicle) {
			throw new BadRequestError('Vehicle does not exist');
		}

		existingLiftRequest.set({
			currentLocation,
			destination,
			timeOfDeparture,
			vehicle: existingVehicle,
			status: LiftRequestStatus.Updated,
		});

		try {
			await existingLiftRequest.save();

			// publishing updated lift request data
			new LiftRequestUpdatedPublisher(natsWrapper.client).publish({
				id: existingLiftRequest.id,
				currentLocation: existingLiftRequest.currentLocation,
				destination: existingLiftRequest.destination,
				timeOfDeparture: existingLiftRequest.timeOfDeparture,
				user: existingUser.id,
				vehicle: existingVehicle.id,
				version: existingLiftRequest.version,
			});

			res.status(201).send(existingLiftRequest);
		} catch (error) {
			throw new BadRequestError('Lift request not updated');
		}
	}
);

export { router as updateLiftRequestRouter };
