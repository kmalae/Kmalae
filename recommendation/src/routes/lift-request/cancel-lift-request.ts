import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';

// importing models and services
import { LiftRequest } from '../../models/lift-request';
import { User } from '../../models/user';

// importing error-types and middlewares
import {
	BadRequestError,
	currentUser,
	validateRequest,
	NotAuthorizedError,
	LiftRequestStatus,
	natsWrapper,
} from '@kmalae.ltd/library';

// importing event publishers and listeners
import { LiftRequestCancelledPublisher } from '../../events/publish/lift-request/lift-request-cancelled-publisher';

const router = express.Router();

router.delete(
	'/api/recomm/cancelLiftRequest',
	[
		body('liftRequestID')
			.notEmpty()
			.withMessage('lift request ID must be provided')
			.custom((value) => mongoose.Types.ObjectId.isValid(value))
			.withMessage('Invalid lift request ID'),
	],
	currentUser,
	validateRequest,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new NotAuthorizedError();
		}
		const { liftRequestID } = req.body;

		const { id, email } = req.currentUser;
		const existingUser = await User.findOne({
			id,
			email,
		});

		if (!existingUser) {
			throw new BadRequestError('User does not exist');
		}

		const existingLiftRequest = await LiftRequest.findById(liftRequestID);

		if (!existingLiftRequest) {
			throw new BadRequestError('Lift request does not exist');
		}

		existingLiftRequest.set({ status: LiftRequestStatus.Cancelled });

		try {
			await existingLiftRequest.save();

			// publishing lift request cancelled data
			new LiftRequestCancelledPublisher(natsWrapper.client).publish({
				id: existingLiftRequest.id,
				user: existingUser.id,
				version: existingLiftRequest.version,
			});

			res.status(200).send(existingLiftRequest);
		} catch (error) {
			throw new BadRequestError('Lift request not cancelled');
		}
	}
);

export { router as cancelLiftRequestRouter };
