import {
	Publisher,
	Subjects,
	LiftRequestCreatedEvent,
} from '@kmalae.ltd/library';

export class LiftRequestCreatdPublisher extends Publisher<LiftRequestCreatedEvent> {
	subject: Subjects.LiftRequestCreated = Subjects.LiftRequestCreated;
}
