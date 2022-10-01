import { Publisher, Subjects, TopupPerformedEvent } from "@kmalae.ltd/library";

export class TopupPerformedPublisher extends Publisher<TopupPerformedEvent> {
	subject: Subjects.TopupPerformed = Subjects.TopupPerformed;
}
