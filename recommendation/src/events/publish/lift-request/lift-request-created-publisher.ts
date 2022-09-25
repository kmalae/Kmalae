import {
	Publisher,
	Subjects,
	LiftRequestCreatedEvent,
} from '@kmalae.ltd/library';

export class LiftRequestCreatedPublisher extends Publisher<LiftRequestCreatedEvent> {
	subject: Subjects.LiftRequestCreated = Subjects.LiftRequestCreated;
}
