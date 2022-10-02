import { Message } from "node-nats-streaming";
import {
	Subjects,
	Listener,
	UserUpdatedEvent,
	BadRequestError,
} from "@kmalae.ltd/library";
import { queueGroupName } from "../queue-group-name";

//importing models and services
import { User } from "../../../models/user";

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
	subject: Subjects.UserUpdated = Subjects.UserUpdated;
	queueGroupName = queueGroupName;

	async onMessage(data: UserUpdatedEvent["data"], msg: Message) {
		const { id, email, version } = data;

		const user = await User.findOne({ id, version: version - 1 });

		if (!user) {
			throw new BadRequestError("User not found");
		}

		user.set({ email, version });
		try {
			await user.save();
			msg.ack();
		} catch (error) {
			throw new BadRequestError("User not updated: Ride-Request");
		}
	}
}
