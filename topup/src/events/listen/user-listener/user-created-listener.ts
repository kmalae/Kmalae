import {
	BadRequestError,
	Listener,
	Subjects,
	UserRegisteredEvent,
	natsWrapper,
} from "@kmalae.ltd/library";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "../queue-group-name";

// importing models and services
import { User } from "../../../models/user";
import { Topup } from "../../../models/topup";

// importing Event publishers
import { TopupCreatedPublisher } from "../../publish/topup-created-publisher";

export class UserRegisteredListener extends Listener<UserRegisteredEvent> {
	subject: Subjects.UserRegistered = Subjects.UserRegistered;
	queueGroupName = queueGroupName;

	async onMessage(data: UserRegisteredEvent["data"], msg: Message) {
		const { id, email, version } = data;

		const user = User.build({
			_id: id,
			email,
			version,
		});

		try {
			await user.save();

			const topup = Topup.build({
				user: user.id,
				points: 0,
				TopupsPerfomed: [],
			});

			try {
				await topup.save();

				// publishing Topup data
				new TopupCreatedPublisher(natsWrapper.client).publish({
					id: topup.id,
					user: user.id,
					points: topup.points,
					version,
				});
			} catch (error) {
				throw new BadRequestError("Topup not created");
			}

			msg.ack();
		} catch (error) {
			console.log(error);
			throw new BadRequestError("User not created: Topup");
		}
	}
}
