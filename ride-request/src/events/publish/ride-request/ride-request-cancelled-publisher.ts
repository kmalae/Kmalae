import {
	Publisher,
	Subjects,
	RideRequestCancelledEvent,
} from '@kmalae.ltd/library';

export class RideRequestCancelledPublisher extends Publisher<RideRequestCancelledEvent> {
	subject: Subjects.RideRequestCancelled = Subjects.RideRequestCancelled;
}
