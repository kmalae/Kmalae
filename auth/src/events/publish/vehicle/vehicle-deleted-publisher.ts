import { Publisher, Subjects, VehicleDeletedEvent } from "@kmalae.ltd/library";

export class VehicleDeletedPublisher extends Publisher<VehicleDeletedEvent> {
	subject: Subjects.VehicleDeleted = Subjects.VehicleDeleted;
}
