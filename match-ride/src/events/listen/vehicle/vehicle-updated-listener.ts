import {
	BadRequestError,
	Listener,
	Subjects,
	VehicleUpdatedEvent,
} from "@kmalae.ltd/library";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "../queue-group-name";

// importing models and services
import { Vehicle } from "../../../models/vehicle";

export class VehicleUpdatedListener extends Listener<VehicleUpdatedEvent> {
	subject: Subjects.VehicleUpdated = Subjects.VehicleUpdated;
	queueGroupName = queueGroupName;

	async onMessage(data: VehicleUpdatedEvent["data"], msg: Message) {
		const { id, carBrand, carModel, MPG, carImage, user, version } = data;
		const previousVersion = version - 1;

		const existingVehicle = await Vehicle.findOne({
			_id: id,
			version: previousVersion,
			user,
		});

		if (!existingVehicle) {
			throw new BadRequestError("Vehicle not found: Match");
		}

		existingVehicle.set({
			carBrand,
			carModel,
			MPG,
			carImage,
		});

		try {
			await existingVehicle.save();

			msg.ack();
		} catch (error) {
			console.log(error);
			throw new BadRequestError("Vehicle not updated: Match");
		}
	}
}
