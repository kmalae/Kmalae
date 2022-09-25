import { Publisher, Subjects, UserDeletedEvent } from "@kmalae.ltd/library";

export class UserDeletedPublisher extends Publisher<UserDeletedEvent> {
	subject: Subjects.UserDeleted = Subjects.UserDeleted;
}
