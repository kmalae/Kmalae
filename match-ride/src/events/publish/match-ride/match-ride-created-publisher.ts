import {
	Publisher,
	Subjects,
	MatchRideCreatedEvent,
} from '@kmalae.ltd/library';

export class MatchRideCreatdPublisher extends Publisher<MatchRideCreatedEvent> {
	subject: Subjects.MatchRideCreated = Subjects.MatchRideCreated;
}
