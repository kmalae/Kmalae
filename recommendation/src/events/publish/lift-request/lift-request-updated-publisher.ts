import {
	Publisher,
	Subjects,
	LiftRequestUpdatedEvent,
} from '@kmalae.ltd/library';

export class LiftRequestUpdatedPublisher extends Publisher<LiftRequestUpdatedEvent> {
	subject: Subjects.LiftRequestUpdated = Subjects.LiftRequestUpdated;
}
