import { app } from "./app";
import mongoose from "mongoose";

app.listen(3000, async () => {
	if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");

	if (!process.env.MONGO_URL) throw new Error("MONGO_URI must be defined");

	try {
		await mongoose.connect(process.env.MONGO_URL);
		console.log("connected to mongodb");
	} catch (error) {
		console.error(error);
	}

	console.log("listening on port 3000");
});
