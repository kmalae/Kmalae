import { Message } from "node-nats-streaming";
import {
	Subjects,
	Listener,
	PaymentPointsDeductedEvent,
	BadRequestError,
	MatchRideStatus,
	natsWrapper,
} from "@kmalae.ltd/library";
import { queueGroupName } from "../queue-group-name";

//importing models and services
import { MatchRide } from "../../../models/match-ride";
import { Review } from "../../../models/review";

// importing Event publishers
import { ReviewCreatedPublisher } from "../../publish/review-created-publisher";

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
			throw new BadRequestError("MatchRide not found: Review");
		}

		existingMatchRide.status = MatchRideStatus.Paid;

		try {
			await existingMatchRide.save();

			const review = Review.build({
				passenger,
				driver,
				matchRide,
			});

			try {
				await review.save();

				// publishing Review data
				new ReviewCreatedPublisher(natsWrapper.client).publish({
					id: review.id,
					passenger,
					driver,
					matchRide,
					version: review.version,
				});
			} catch (error) {
				throw new BadRequestError("Review not created");
			}

			msg.ack();
		} catch (error) {
			throw new BadRequestError("MatchRide not updated: Review");
		}
	}
}
