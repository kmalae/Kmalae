import {
	Listener,
	Subjects,
	MatchRideCreatedEvent,
	BadRequestError,
	MatchRideStatus,
} from "@kmalae.ltd/library";
import { Message } from "node-nats-streaming";
import { MatchRide } from "../../../models/match-ride";
import { queueGroupName } from "../queue-group-name";

export class MatchRideCreatedListener extends Listener<MatchRideCreatedEvent> {
	subject: Subjects.MatchRideCreated = Subjects.MatchRideCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: MatchRideCreatedEvent["data"], msg: Message) {
		const { id, driver, passenger, destination, timeOfDeparture, createdAt } =
			data;

		const matchRide = MatchRide.build({
			id,
			driver,
			passenger,
			destination,
			timeOfDeparture,
			createdAt,
			status: MatchRideStatus.Requested,
		});

		try {
			await matchRide.save();

			msg.ack();
		} catch (error) {
			console.log(error);
			throw new BadRequestError("Match ride not created: Payment");
		}
	}
}
