import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { natsWrapper } from '../../nats-wrapper';

// importing models
import { User } from '../../models/user';

// importing error-types and middlewares
import { BadRequestError, validateRequest } from '@kmalae.ltd/library';
import { UserRegisteredPublisher } from '../../events/publish/user/user-registered-publisher';

const router = express.Router();

router.post(
	'/api/users/signup',
	[
		body('email')
			.notEmpty()
			.withMessage('Email must be provided')
			.isEmail()
			.withMessage('Email must be valid'),
		body('password')
			.notEmpty()
			.withMessage('Password must be provided')
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must be between 4 and 20 characters'),
		body('firstName')
			.notEmpty()
			.withMessage('First name must be provided')
			.isAlphanumeric()
			.withMessage('First name cannot contain a digit'),
		body('lastName')
			.notEmpty()
			.withMessage('Last name must be provided')
			.isAlphanumeric()
			.withMessage('Last name cannot contain a digit'),
		body('IDNumber')
			.notEmpty()
			.withMessage('ID number must be provided')
			.isNumeric()
			.isLength({ min: 8, max: 8 })
			.withMessage('ID number must be valid'),
		body('dateOfBirth')
			.notEmpty()
			.withMessage('Date of birth must be provided')
			.isISO8601()
			.withMessage('Incorrect date format')
			.exists()
			.isDate()
			.withMessage('Date of birth must be valid'),
		body('phoneNumber')
			.notEmpty()
			.withMessage('Phone number must be provided')
			.isMobilePhone('ar-AE')
			.withMessage('Invalid phone number'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const {
			email,
			password,
			firstName,
			lastName,
			IDNumber,
			dateOfBirth,
			phoneNumber,
		} = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			throw new BadRequestError('Email already exists');
		}

		const user = User.build({
			email,
			password,
			firstName,
			lastName,
			IDNumber,
			dateOfBirth,
			phoneNumber,
		});

		try {
			user.save();

			// Generate JWT
			const userJwt = jwt.sign(
				{
					id: user.id,
					email: user.email,
				},
				process.env.JWT_KEY!
			);

			// Store JWT on session object
			req.session = {
				jwt: userJwt,
			};

			//publishing user data
			new UserRegisteredPublisher(natsWrapper.client).publish({
				id: user.id,
				email: user.email,
				version: user.version,
			});
			return res.status(201).send(user);
		} catch (error) {
			throw new BadRequestError('User not created');
		}
	}
);

export { router as signupRouter };
