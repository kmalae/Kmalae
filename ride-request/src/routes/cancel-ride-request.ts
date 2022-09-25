import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';

// importing models and services
import { RideRequest } from '../models/ride-request';
import { User } from '../models/user';

// importing error-types and middlewares
import {
	BadRequestError,
	currentUser,
	validateRequest,
	NotAuthorizedError,
	RideRequestStatus,
	natsWrapper,
} from '@kmalae.ltd/library';

// importing event publishers and listeners
import { RideRequestCancelledPublisher } from '../events/publish/ride-request/ride-request-cancelled-publisher';

const router = express.Router();

router.delete(
	'/api/rides/cancelRideRequest',
	[
		body('rideRequestID')
			.notEmpty()
			.withMessage('ride request ID must be provided')
			.custom((value) => mongoose.Types.ObjectId.isValid(value))
			.withMessage('Invalid ride request ID'),
	],
	currentUser,
	validateRequest,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new NotAuthorizedError();
		}
		const { rideRequestID } = req.body;

		const { id, email } = req.currentUser;
		const existingUser = await User.findOne({
			id,
			email,
		});

		if (!existingUser) {
			throw new BadRequestError('User does not exist');
		}

		const existingRideRequest = await RideRequest.findById(rideRequestID);

		if (!existingRideRequest) {
			throw new BadRequestError('Ride request does not exist');
		}

		existingRideRequest.set({ status: RideRequestStatus.Cancelled });

		try {
			await existingRideRequest.save();

			// publishing ride request cancelled data
			new RideRequestCancelledPublisher(natsWrapper.client).publish({
				id: existingRideRequest.id,
				user: existingUser.id,
				version: existingRideRequest.version,
			});

			res.status(200).send(existingRideRequest);
		} catch (error) {
			throw new BadRequestError('Ride request not cancelled');
		}
	}
);

export { router as cancelRideRequestRouter };
