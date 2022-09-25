import express, { Request, Response } from 'express';
import { body } from 'express-validator';

// importing models and services
import { RideRequest } from '../models/ride-request';
import { User } from '../models/user';

// importing error-types, middlewares, types, and services
import {
	currentUser,
	NotAuthorizedError,
	validateRequest,
	LocationType,
	Location,
	BadRequestError,
	natsWrapper,
} from '@kmalae.ltd/library';

// importing event publishers and listeners
import { RideRequestCreatdPublisher } from '../events/publish/ride-request/ride-request-created-publisher';

const router = express.Router();

router.post(
	'/api/rides/createRideRequest',
	[
		body('pickUpPoint')
			.custom((input: LocationType) => {
				return Location(input);
			})
			.withMessage('Invalid pick up location'),
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
			.isDate()
			.withMessage('Departure time must be valid'),
	],
	currentUser,
	validateRequest,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new NotAuthorizedError();
		}

		const { pickUpPoint, destination, timeOfDeparture } = req.body;
		const { id, email } = req.currentUser;

		const existingUser = await User.findOne({
			id,
			email,
		});

		if (!existingUser) {
			throw new BadRequestError('User does not exist');
		}

		const rideRequest = RideRequest.build({
			pickUpPoint,
			destination,
			timeOfDeparture,
			user: existingUser,
		});

		try {
			await rideRequest.save();

			// publishing ride request data
			new RideRequestCreatdPublisher(natsWrapper.client).publish({
				id: rideRequest.id,
				pickUpPoint: rideRequest.pickUpPoint,
				destination: rideRequest.destination,
				timeOfDeparture: rideRequest.timeOfDeparture,
				user: existingUser.id,
				version: rideRequest.version,
			});

			res.status(201).send(rideRequest);
		} catch (error) {
			throw new BadRequestError('Ride request not created');
		}
	}
);

export { router as createRideRequestRouter };
