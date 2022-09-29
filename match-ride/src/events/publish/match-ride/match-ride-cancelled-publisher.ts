import {
	Publisher,
	Subjects,
	MatchRideCancelledEvent,
} from '@kmalae.ltd/library';

export class MatchRideCancelledPublisher extends Publisher<MatchRideCancelledEvent> {
	subject: Subjects.MatchRideCancelled = Subjects.MatchRideCancelled;
}
