import {
	Listener,
	Subjects,
	BadRequestError,
	TopupPerformedEvent,
} from "@kmalae.ltd/library";
import { Message } from "node-nats-streaming";

// importing models and services
import { Topup } from "../../../models/topup";
import { queueGroupName } from "../queue-group-name";

export class TopupPerformedListener extends Listener<TopupPerformedEvent> {
	subject: Subjects.TopupPerformed = Subjects.TopupPerformed;
	queueGroupName = queueGroupName;

	async onMessage(data: TopupPerformedEvent["data"], msg: Message) {
		const { id, user, points, version } = data;

		const previousVersion = version - 1;
		const existingTopup = await Topup.findOne({
			_id: id,
			user,
			version: previousVersion,
		});

		if (!existingTopup) {
			throw new BadRequestError("Topup not found: Payment");
		}

		existingTopup.points = points;

		try {
			await existingTopup.save();

			msg.ack();
		} catch (error) {
			console.log(error);
			throw new BadRequestError("Topup not performed: Payment");
		}
	}
}
