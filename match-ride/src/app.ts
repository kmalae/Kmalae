import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';

// importing error-types and middlewares
import { errorHandler, NotFoundError } from '@kmalae.ltd/library';

// importing routers
import { createMatchRequestRouter } from './routes/create-match-request';
import { cancelMatchRequestRouter } from './routes/driver-cancel-request';
import { passengerCancelledRequestRouter } from './routes/passenger-cancelled-request';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== 'test',
	})
);

app.use(createMatchRequestRouter);
app.use(cancelMatchRequestRouter);
app.use(passengerCancelledRequestRouter);

app.all('*', async (req, res, next) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
