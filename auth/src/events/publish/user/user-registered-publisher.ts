import { Publisher, Subjects, UserRegisteredEvent } from "@kmalae.ltd/library";

export class UserRegisteredPublisher extends Publisher<UserRegisteredEvent> {
  subject: Subjects.UserRegistered = Subjects.UserRegistered;
}