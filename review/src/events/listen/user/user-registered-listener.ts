import {
	BadRequestError,
	Listener,
	Subjects,
	UserRegisteredEvent,
} from "@kmalae.ltd/library";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "../queue-group-name";

// importing models and services
import { User } from "../../../models/user";

export class UserRegisteredListener extends Listener<UserRegisteredEvent> {
	subject: Subjects.UserRegistered = Subjects.UserRegistered;
	queueGroupName = queueGroupName;

	async onMessage(data: UserRegisteredEvent["data"], msg: Message) {
		const { id, email, firstName, lastName } = data;

		const user = User.build({
			_id: id,
			email,
			firstName,
			lastName,
		});

		try {
			await user.save();

			msg.ack();
		} catch (error) {
			console.log(error);
			throw new BadRequestError("User not created: Review");
		}
	}
}
