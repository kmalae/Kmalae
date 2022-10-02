import { Message } from "node-nats-streaming";
import {
	Subjects,
	Listener,
	PaymentPointsDeductedEvent,
	BadRequestError,
	MatchRideStatus,
} from "@kmalae.ltd/library";
import { queueGroupName } from "../queue-group-name";

//importing models and services
import { MatchRide } from "../../../models/match-ride";

export class PaymentPointsDeductedListener extends Listener<PaymentPointsDeductedEvent> {
	subject: Subjects.PaymentPointsDeducted = Subjects.PaymentPointsDeducted;
	queueGroupName = queueGroupName;

	async onMessage(data: PaymentPointsDeductedEvent["data"], msg: Message) {
		const { matchRide, passenger, driver, matchRideVersion } = data;

		const previousVersion = matchRideVersion - 1;
		const existingMatchRide = await MatchRide.findOne({
			id: matchRide,
			passenger,
			driver,
			version: previousVersion,
		});

		if (!existingMatchRide) {
			throw new BadRequestError("MatchRide not found: Match");
		}

		existingMatchRide.status = MatchRideStatus.Paid;

		try {
			await existingMatchRide.save();

			msg.ack();
		} catch (error) {
			throw new BadRequestError("MatchRide not updated: Match");
		}
	}
}
