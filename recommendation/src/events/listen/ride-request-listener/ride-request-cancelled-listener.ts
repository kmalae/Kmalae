import {
	Listener,
	Subjects,
	RideRequestCancelledEvent,
	BadRequestError,
	RideRequestStatus,
} from "@kmalae.ltd/library";
import { Message } from "node-nats-streaming";
import { RideRequest } from "../../../models/ride-request";
import { queueGroupName } from "../queue-group-name";

export class RideRequestCancelledListener extends Listener<RideRequestCancelledEvent> {
	subject: Subjects.RideRequestCancelled = Subjects.RideRequestCancelled;
	queueGroupName = queueGroupName;

	async onMessage(data: RideRequestCancelledEvent["data"], msg: Message) {
		const { id, user, version } = data;

		const previousVersion = version - 1;
		const existingRideRequest = await RideRequest.findOne({
			_id: id,
			user,
			version: previousVersion,
		});

		if (!existingRideRequest) {
			throw new BadRequestError("Ride request not found: Recomm");
		}

		existingRideRequest.set({
			status: RideRequestStatus.Cancelled,
		});

		try {
			await existingRideRequest.save();

			msg.ack();
		} catch (error) {
			console.log(error);
			throw new BadRequestError("Ride request not cancelled: Recomm");
		}
	}
}
