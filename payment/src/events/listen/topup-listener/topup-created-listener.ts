import {
	Listener,
	Subjects,
	BadRequestError,
	TopupCreatedEvent,
} from "@kmalae.ltd/library";
import { Message } from "node-nats-streaming";
import { Topup } from "../../../models/topup";
import { queueGroupName } from "../queue-group-name";

export class TopupCreatedListener extends Listener<TopupCreatedEvent> {
	subject: Subjects.TopupCreated = Subjects.TopupCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: TopupCreatedEvent["data"], msg: Message) {
		const { id, user, points } = data;

		const topup = Topup.build({
			_id: id,
			user,
			points,
		});

		try {
			await topup.save();

			msg.ack();
		} catch (error) {
			console.log(error);
			throw new BadRequestError("Topup not created: Payment");
		}
	}
}
