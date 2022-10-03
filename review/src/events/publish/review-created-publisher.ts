import { Publisher, Subjects, ReviewCreatedEvent } from "@kmalae.ltd/library";

export class ReviewCreatedPublisher extends Publisher<ReviewCreatedEvent> {
	subject: Subjects.ReviewCreated = Subjects.ReviewCreated;
}
