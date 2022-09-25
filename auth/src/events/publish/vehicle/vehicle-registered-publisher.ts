import { Publisher, Subjects, VehicleRegisteredEvent } from "@kmalae.ltd/library";

export class VehicleRegisteredPublisher extends Publisher<VehicleRegisteredEvent> {
  subject: Subjects.VehicleRegistered = Subjects.VehicleRegistered;
}