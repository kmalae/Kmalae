import { Publisher, Subjects, ReviewUpdatedEvent } from "@kmalae.ltd/library";

export class ReviewUpdatedPublisher extends Publisher<ReviewUpdatedEvent> {
	subject: Subjects.ReviewUpdated = Subjects.ReviewUpdated;
}
