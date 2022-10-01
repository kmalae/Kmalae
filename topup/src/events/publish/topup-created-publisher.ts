import { Publisher, Subjects, TopupCreatedEvent } from "@kmalae.ltd/library";

export class TopupCreatedPublisher extends Publisher<TopupCreatedEvent> {
	subject: Subjects.TopupCreated = Subjects.TopupCreated;
}
