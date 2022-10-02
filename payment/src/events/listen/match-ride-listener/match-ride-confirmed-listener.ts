import {
	Listener,
	Subjects,
	MatchRideConfirmedEvent,
	BadRequestError,
	MatchRideStatus,
} from "@kmalae.ltd/library";
import { Message } from "node-nats-streaming";
import { MatchRide } from "../../../models/match-ride";
import { queueGroupName } from "../queue-group-name";

export class MatchRideConfirmedListener extends Listener<MatchRideConfirmedEvent> {
	subject: Subjects.MatchRideConfirmed = Subjects.MatchRideConfirmed;
	queueGroupName = queueGroupName;

	async onMessage(data: MatchRideConfirmedEvent["data"], msg: Message) {
		const { id, version } = data;

		const previousVersion = version - 1;
		const existingMatchRide = await MatchRide.findOne({
			_id: id,
			version: previousVersion,
		});

		if (!existingMatchRide) {
			throw new BadRequestError("Match ride not found: Payment");
		}

		existingMatchRide.set({
			status: MatchRideStatus.Confirmed,
		});

		try {
			await existingMatchRide.save();

			msg.ack();
		} catch (error) {
			console.log(error);
			throw new BadRequestError("Match ride not confirmed: Payment");
		}
	}
}
