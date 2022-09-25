import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';

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

app.all('*', async (req, res, next) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
