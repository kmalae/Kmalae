import { natsWrapper } from "@kmalae.ltd/library";
import mongoose from "mongoose";
import { app } from "./app";

// importing User event listeners
import { UserRegisteredListener } from "./events/listen/user/user-registered-listener";
import { UserUpdatedListener } from "./events/listen/user/user-updated-listener";

// importing Vehicle event listeners
import { VehicleRegisteredListener } from "./events/listen/vehicle/vehicle-registered-listener";
import { VehicleUpdatedListener } from "./events/listen/vehicle/vehicle-updated-listener";
import { VehicleDeletedListener } from "./events/listen/vehicle/vehicle-deleted-listener";

// importing Ride-Request event listeners
import { RideRequestCreatedListener } from "./events/listen/ride-request-listener/ride-request-created-listener";
import { RideRequestUpdatedListener } from "./events/listen/ride-request-listener/ride-request-updated-listener";
import { RideRequestCancelledListener } from "./events/listen/ride-request-listener/ride-request-cancelled-listener";

// importing Lift-Request event listeners
import { LiftRequestCreatedListener } from "./events/listen/lift-request-listener/lift-request-created-listener";
import { LiftRequestUpdatedListener } from "./events/listen/lift-request-listener/lift-request-updated-listener";
import { LiftRequestCancelledListener } from "./events/listen/lift-request-listener/lift-request-cancelled-listener";

app.listen(3000, async () => {
	if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");

	if (!process.env.MONGO_URL) throw new Error("MONGO_URI must be defined");

	if (!process.env.NATS_CLIENT_ID) {
		throw new Error("NATS_CLIENT_ID must be defined");
	}

	if (!process.env.NATS_URL) {
		throw new Error("NATS_URL must be defined");
	}

	if (!process.env.NATS_CLUSTER_ID) {
		throw new Error("NATS_CLUSTER_ID must be defined");
	}

	try {
		await mongoose.connect(process.env.MONGO_URL, {
			dbName: "Match-Ride-DB",
		});
		console.log("connected to mongodb");
		await natsWrapper.connect(
			process.env.NATS_CLUSTER_ID,
			process.env.NATS_CLIENT_ID,
			process.env.NATS_URL
		);

		natsWrapper.client.on("close", () => {
			console.log("NATS connection closed!");
			process.exit();
		});

		process.on("SIGINT", () => natsWrapper.client.close());
		process.on("SIGTERM", () => natsWrapper.client.close());

		// Listenting to User changes
		new UserRegisteredListener(natsWrapper.client).listen();
		new UserUpdatedListener(natsWrapper.client).listen();

		// Listening to Vehicle changes
		new VehicleRegisteredListener(natsWrapper.client).listen();
		new VehicleUpdatedListener(natsWrapper.client).listen();
		new VehicleDeletedListener(natsWrapper.client).listen();

		// Listening to Ride-Request changes
		new RideRequestCreatedListener(natsWrapper.client).listen();
		new RideRequestUpdatedListener(natsWrapper.client).listen();
		new RideRequestCancelledListener(natsWrapper.client).listen();

		// Listening to Ride-Request changes
		new LiftRequestCreatedListener(natsWrapper.client).listen();
		new LiftRequestUpdatedListener(natsWrapper.client).listen();
		new LiftRequestCancelledListener(natsWrapper.client).listen();
	} catch (error) {
		console.error(error);
	}

	console.log("listening on port 3000");
});
