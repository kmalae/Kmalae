import {
	Listener,
	Subjects,
	MatchRideCancelledEvent,
	BadRequestError,
	MatchRideStatus,
} from "@kmalae.ltd/library";
import { Message } from "node-nats-streaming";
import { MatchRide } from "../../../models/match-ride";
import { queueGroupName } from "../queue-group-name";

export class MatchRideCancelledListener extends Listener<MatchRideCancelledEvent> {
	subject: Subjects.MatchRideCancelled = Subjects.MatchRideCancelled;
	queueGroupName = queueGroupName;

	async onMessage(data: MatchRideCancelledEvent["data"], msg: Message) {
		const { id, whoCancelled, version } = data;

		const previousVersion = version - 1;
		const existingMatchRide = await MatchRide.findOne({
			_id: id,
			version: previousVersion,
		});

		if (!existingMatchRide) {
			throw new BadRequestError("Match ride not found: Payment");
		}

		existingMatchRide.set({
			status: MatchRideStatus.Cancelled,
			whoCancelled,
		});

		try {
			await existingMatchRide.save();

			msg.ack();
		} catch (error) {
			console.log(error);
			throw new BadRequestError("Match ride not cancelled: Payment");
		}
	}
}
