import {
	Publisher,
	Subjects,
	RideRequestUpdatedEvent,
} from '@kmalae.ltd/library';

export class RideRequestUpdatedPublisher extends Publisher<RideRequestUpdatedEvent> {
	subject: Subjects.RideRequestUpdated = Subjects.RideRequestUpdated;
}
