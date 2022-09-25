import {
	Publisher,
	Subjects,
	LiftRequestCancelledEvent,
} from '@kmalae.ltd/library';

export class LiftRequestCancelledPublisher extends Publisher<LiftRequestCancelledEvent> {
	subject: Subjects.LiftRequestCancelled = Subjects.LiftRequestCancelled;
}
