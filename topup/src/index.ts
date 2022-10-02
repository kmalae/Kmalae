import { natsWrapper } from "@kmalae.ltd/library";
import mongoose from "mongoose";
import { app } from "./app";
import { PaymentPointsDeductedListener } from "./events/listen/payment-listener/payment-point-deducted-listener";

// importing Event listeners
import { UserRegisteredListener } from "./events/listen/user-listener/user-created-listener";
import { UserUpdatedListener } from "./events/listen/user-listener/user-updated-listener";

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
			dbName: "Topup-DB",
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

		// Listening to User data
		new UserRegisteredListener(natsWrapper.client).listen();
		new UserUpdatedListener(natsWrapper.client).listen();

		// Listening to Payment data for restarting
		new PaymentPointsDeductedListener(natsWrapper.client).listen();
	} catch (error) {
		console.error(error);
	}

	console.log("listening on port 3000");
});
