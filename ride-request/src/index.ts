import express from "express";
import { json } from "body-parser";
import mongoose from "mongoose";
import "express-async-errors";
import cookieSession from "cookie-session";

// importing routers
// import { createRideRequestRouter } from "./routes/create-ride-request";
import { deleteRideRequestRouter } from "./routes/cancel-ride-request";

// importing error-types and middlewares
import { errorHandler, NotFoundError } from "@kmalae.ltd/library";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== "test",
	})
);

// app.use(createRideRequestRouter);
app.use(deleteRideRequestRouter);


app.all("*", async (req, res, next) => {
	throw new NotFoundError();
});

app.use(errorHandler);

app.listen(3000, async () => {
	if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");

	if (!process.env.MONGO_URL) throw new Error("MONGO_URI must be defined");

	try {
		await mongoose.connect(process.env.MONGO_URL, {
			dbName: "Ride-Request-DB",
		});
		console.log("connected to mongodb");
	} catch (error) {
		console.error(error);
	}

	console.log("listening on port 3000");
});
