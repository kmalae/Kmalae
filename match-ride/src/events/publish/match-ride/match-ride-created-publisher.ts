import {
	Publisher,
	Subjects,
	MatchRideCreatedEvent,
} from '@kmalae.ltd/library';

export class MatchRideCreatedPublisher extends Publisher<MatchRideCreatedEvent> {
	subject: Subjects.MatchRideCreated = Subjects.MatchRideCreated;
}
