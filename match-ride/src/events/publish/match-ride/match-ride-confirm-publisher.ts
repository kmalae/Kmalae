import {
	Publisher,
	Subjects,
	MatchRideConfirmedEvent,
} from '@kmalae.ltd/library';

export class MatchRideConfirmedPublisher extends Publisher<MatchRideConfirmedEvent> {
	subject: Subjects.MatchRideConfirmed = Subjects.MatchRideConfirmed;
}
