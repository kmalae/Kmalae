import { Message } from "node-nats-streaming";
import {
	Subjects,
	Listener,
	PaymentPointsDeductedEvent,
	BadRequestError,
} from "@kmalae.ltd/library";
import { queueGroupName } from "../queue-group-name";

//importing models and services
import { Topup } from "../../../models/topup";

export class PaymentPointsDeductedListener extends Listener<PaymentPointsDeductedEvent> {
	subject: Subjects.PaymentPointsDeducted = Subjects.PaymentPointsDeducted;
	queueGroupName = queueGroupName;

	async onMessage(data: PaymentPointsDeductedEvent["data"], msg: Message) {
		const {
			passenger,
			driver,
			amountPaid,
			passengerTopupVersion,
			driverTopupVersion,
		} = data;

		const previousPassengerTopupVersion = passengerTopupVersion - 1;
		const passengerTopup = await Topup.findOne({
			id: passenger,
			version: previousPassengerTopupVersion,
		});

		if (!passengerTopup) {
			throw new BadRequestError("Passenger not found: Topup");
		}

		const previousDriverTopupVersion = driverTopupVersion - 1;
		const driverTopup = await Topup.findOne({
			id: driver,
			version: previousDriverTopupVersion,
		});
		if (!driverTopup) {
			throw new BadRequestError("Driver not found: Topup");
		}

		passengerTopup.points = passengerTopup.points - amountPaid;
		driverTopup.points = driverTopup.points + parseInt(amountPaid.toString());

		try {
			await passengerTopup.save();
			await driverTopup.save();

			msg.ack();
		} catch (error) {
			console.log(error);
			throw new BadRequestError("Payment not performed: Topup");
		}
	}
}
