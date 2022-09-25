import { Publisher, Subjects, UserUpdatedEvent } from "@kmalae.ltd/library";

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
	subject: Subjects.UserUpdated = Subjects.UserUpdated;
}
