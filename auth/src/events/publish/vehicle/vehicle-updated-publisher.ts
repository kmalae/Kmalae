import { Publisher, Subjects, VehicleUpdatedEvent } from "@kmalae.ltd/library";

export class VehicleUpdatedPublisher extends Publisher<VehicleUpdatedEvent> {
	subject: Subjects.VehicleUpdated = Subjects.VehicleUpdated;
}
