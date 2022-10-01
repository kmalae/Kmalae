import {
	Publisher,
	Subjects,
	RideRequestCreatedEvent,
} from '@kmalae.ltd/library';

export class RideRequestCreatdPublisher extends Publisher<RideRequestCreatedEvent> {
	subject: Subjects.RideRequestCreated = Subjects.RideRequestCreated;
}
