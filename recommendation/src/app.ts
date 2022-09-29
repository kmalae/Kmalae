import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";

// importing error-types and middlewares
import { errorHandler, NotFoundError } from "@kmalae.ltd/library";

// importing routers
import { createLiftRequestRouter } from "./routes/lift-request/create-lift-request";
import { getLiftRequestRouter } from "./routes/lift-request/get-lift-request";
import { getUserLiftRequestsRouter } from "./routes/lift-request/get-user-lift-requests";
import { updateLiftRequestRouter } from "./routes/lift-request/update-lift-request";
import { cancelLiftRequestRouter } from "./routes/lift-request/cancel-lift-request";
import { getPassengerReviewRouter } from "./routes/ride-data/get-passenger-review";
import { getMutualRequestsRouter } from "./routes/ride-data/get-mutual-requests";
import { getDriverVehicleRouter } from "./routes/ride-data/get-driver-vehicle";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== "test",
	})
);

app.use(createLiftRequestRouter);
app.use(getLiftRequestRouter);
app.use(getUserLiftRequestsRouter);
app.use(updateLiftRequestRouter);
app.use(cancelLiftRequestRouter);
app.use(getMutualRequestsRouter);
app.use(getPassengerReviewRouter);
app.use(getDriverVehicleRouter);

app.all("*", async (req, res, next) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
