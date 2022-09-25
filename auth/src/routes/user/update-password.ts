import express, { Request, Response } from 'express';
import { body } from 'express-validator';

// importing models and services
import { User } from '../../models/user';
import { Password } from '../../services/password';

// importing error-types and middlewares
import {
	BadRequestError,
	currentUser,
	validateRequest,
} from '@kmalae.ltd/library';

interface UserPaylod {
	id: string;
	email: string;
}

const router = express.Router();

router.post(
	'/api/users/updatePassword',
	[
		body('oldPassword').notEmpty().withMessage('Old password must be provided'),
		body('newPassword')
			.notEmpty()
			.withMessage('Password must be provided')
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must be between 4 and 20 characters long'),
	],
	validateRequest,
	currentUser,
	async (req: Request, res: Response) => {
		if (!req.currentUser) {
			throw new BadRequestError('User not authenticated');
		}

		const { oldPassword, newPassword } = req.body;
		const { id, email } = req.currentUser;

		const existingUser = await User.findOne({ id, email });
		if (!existingUser) {
			throw new BadRequestError('User does not exist');
		}

		if (!(await Password.compare(existingUser.password, oldPassword))) {
			throw new BadRequestError('Incorrect credential');
		}

		try {
			const hashedPassword = await Password.toHash(newPassword);
			await User.updateOne(
				{ id: existingUser.id, email: existingUser.email },
				{ password: hashedPassword, passwordLastUpdatedAt: new Date() }
			);

			res.status(200).send(existingUser);
		} catch (error) {
			throw new BadRequestError('Password not updated');
		}
	}
);

export { router as updatePasswordRouter };
