import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';

// importing routers
import { cancelRideRequestRouter } from './routes/cancel-ride-request';
import { createRideRequestRouter } from './routes/create-ride-request';
import { getRideRequestRouter } from './routes/get-ride-request';
import { updateRideRequestRouter } from './routes/update-ride-request';
import { getUserRideRequestsRouter } from './routes/get-user-ride-requests';

// importing error-types and middlewares
import { errorHandler, NotFoundError } from '@kmalae.ltd/library';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== 'test',
	})
);

app.use(createRideRequestRouter);
app.use(cancelRideRequestRouter);
app.use(getRideRequestRouter);
app.use(getUserRideRequestsRouter);
app.use(updateRideRequestRouter);

app.all('*', async (req, res, next) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
