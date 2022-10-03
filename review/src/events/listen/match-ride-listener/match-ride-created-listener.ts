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
		const { id, driver, passenger, createdAt, version } = data;

		const matchRide = MatchRide.build({
			_id: id,
			driver,
			passenger,
			createdAt,
			version,
		});

		try {
			await matchRide.save();

			msg.ack();
		} catch (error) {
			console.log(error);
			throw new BadRequestError("Match ride not created: Review");
		}
	}
}
