import {
	Listener,
	Subjects,
	RideRequestUpdatedEvent,
	BadRequestError,
} from "@kmalae.ltd/library";
import { Message } from "node-nats-streaming";
import { RideRequest } from "../../../models/ride-request";
import { queueGroupName } from "../queue-group-name";

export class RideRequestUpdatedListener extends Listener<RideRequestUpdatedEvent> {
	subject: Subjects.RideRequestUpdated = Subjects.RideRequestUpdated;
	queueGroupName = queueGroupName;

	async onMessage(data: RideRequestUpdatedEvent["data"], msg: Message) {
		const { id, pickUpPoint, destination, timeOfDeparture, user, version } =
			data;

		const previousVersion = version - 1;
		const existingRideRequest = await RideRequest.findOne({
			_id: id,
			version: previousVersion,
		});

		if (!existingRideRequest) {
			throw new BadRequestError("Ride request not found: Match");
		}

		existingRideRequest.set({
			_id: id,
			pickUpPoint,
			destination,
			timeOfDeparture,
			user,
		});

		try {
			await existingRideRequest.save();

			msg.ack();
		} catch (error) {
			console.log(error);
			throw new BadRequestError("Ride request not updated: Match");
		}
	}
}
