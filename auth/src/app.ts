import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";

// importing routers
import { signupRouter } from "./routes/user/signup";
import { signinRouter } from "./routes/user/signin";
import { currentUserRouter } from "./routes/user/current-user";
import { signoutRouter } from "./routes/user/signout";
import { getInfoRouter } from "./routes/user/get-info";
import { updateInfoRouter } from "./routes/user/update-info";
import { updatePasswordRouter } from "./routes/user/update-password";
import { registerVehicleRouter } from "./routes/vehicle/register-vehicle";
import { getUserVehiclesRouter } from "./routes/vehicle/get-user-vehicles";
import { getVehicleInfoRouter } from "./routes/vehicle/get-vehicle-info";
import { deleteVehicleRouter } from "./routes/vehicle/delete-vehicle";
import { updateVehicleRouter } from "./routes/vehicle/update-vehicle";

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

app.use(signupRouter);
app.use(signinRouter);
app.use(currentUserRouter);
app.use(signoutRouter);
app.use(getInfoRouter);
app.use(updateInfoRouter);
app.use(updatePasswordRouter);
app.use(registerVehicleRouter);
app.use(getUserVehiclesRouter);
app.use(getVehicleInfoRouter);
app.use(deleteVehicleRouter);
app.use(updateVehicleRouter);

app.all("*", async (req, res, next) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
