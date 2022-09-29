import {
	Listener,
	Subjects,
	RideRequestCreatedEvent,
	BadRequestError,
} from "@kmalae.ltd/library";
import { Message } from "node-nats-streaming";
import { RideRequest } from "../../../models/ride-request";
import { queueGroupName } from "../queue-group-name";

export class RideRequestCreatedListener extends Listener<RideRequestCreatedEvent> {
	subject: Subjects.RideRequestCreated = Subjects.RideRequestCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: RideRequestCreatedEvent["data"], msg: Message) {
		const { id, pickUpPoint, destination, timeOfDeparture, user, version } =
			data;

		const rideRequest = RideRequest.build({
			_id: id,
			pickUpPoint,
			destination,
			timeOfDeparture,
			user,
			version,
		});

		try {
			await rideRequest.save();

			msg.ack();
		} catch (error) {
			console.log(error);
			throw new BadRequestError("Ride request not updated: Match");
		}
	}
}
