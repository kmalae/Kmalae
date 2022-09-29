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
	MatchRideStatus,
	natsWrapper,
	WhoCancelled,
} from '@kmalae.ltd/library';

// importing event publishers and listeners
import { MatchRideCancelledPublisher } from '../events/publish/match-ride/match-ride-cancelled-publisher';

const router = express.Router();

router.delete(
	'/api/match/cancelMatchRequest',
	[
		body('matchRequestID')
			.notEmpty()
			.withMessage('Match request ID must be provided')
			.custom((value) => mongoose.Types.ObjectId.isValid(value))
			.withMessage('Invalid match ride request ID'),
	],
	currentUser,
	validateRequest,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new NotAuthorizedError();
		}

		const { matchRequestID } = req.body;

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

		if(existingMatchRide.status !== MatchRideStatus.Requested){
			throw new BadRequestError("Driver cannot cancel")
		}

		existingMatchRide.set({ status: MatchRideStatus.Cancelled, whoCancelled: WhoCancelled.Driver});

		try {
			await existingMatchRide.save();

			// publishing ride request cancelled data
			new MatchRideCancelledPublisher(natsWrapper.client).publish({
				id: existingMatchRide.id,
				whoCancelled: WhoCancelled.Driver,
				version:existingMatchRide.version,
			});
		
			res.status(200).send(existingMatchRide);
		} catch (error) {
			throw new BadRequestError('Matched request not cancelled');
		}
	}
);

export { router as cancelMatchRequestRouter };
