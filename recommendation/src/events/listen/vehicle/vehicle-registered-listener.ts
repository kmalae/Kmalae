import {
	BadRequestError,
	Listener,
	Subjects,
	VehicleRegisteredEvent,
} from "@kmalae.ltd/library";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "../queue-group-name";

// importing models and services
import { Vehicle } from "../../../models/vehicle";

export class VehicleRegisteredListener extends Listener<VehicleRegisteredEvent> {
	subject: Subjects.VehicleRegistered = Subjects.VehicleRegistered;
	queueGroupName = queueGroupName;

	async onMessage(data: VehicleRegisteredEvent["data"], msg: Message) {
		const { id, carBrand, carModel, MPG, carImage, user, version } = data;

		const vehicle = Vehicle.build({
			_id: id,
			carBrand,
			carModel,
			MPG,
			carImage,
			user,
			version,
		});

		try {
			await vehicle.save();

			msg.ack();
		} catch (error) {
			console.log(error);
			throw new BadRequestError("Vehicle not registered: Recomm");
		}
	}
}
