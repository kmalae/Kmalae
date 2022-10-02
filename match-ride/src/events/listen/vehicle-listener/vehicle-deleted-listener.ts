import {
	BadRequestError,
	Listener,
	Subjects,
	VehicleDeletedEvent,
	VehicleStatus,
} from "@kmalae.ltd/library";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "../queue-group-name";

// importing models and services
import { Vehicle } from "../../../models/vehicle";

export class VehicleDeletedListener extends Listener<VehicleDeletedEvent> {
	subject: Subjects.VehicleDeleted = Subjects.VehicleDeleted;
	queueGroupName = queueGroupName;

	async onMessage(data: VehicleDeletedEvent["data"], msg: Message) {
		const { id, user, version } = data;

		const existingVehicle = await Vehicle.findOne({
			_id: id,
			user,
			version,
		});

		if (!existingVehicle) {
			throw new BadRequestError("Vehicle not found: Match");
		}

		existingVehicle.set({
			status: VehicleStatus.Deleted,
		});

		try {
			await existingVehicle.save();

			msg.ack();
		} catch (error) {
			console.log(error);
			throw new BadRequestError("Vehicle not deleted: Match");
		}
	}
}
