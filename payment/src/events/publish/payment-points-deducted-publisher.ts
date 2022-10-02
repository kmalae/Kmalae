import {
	Publisher,
	Subjects,
	PaymentPointsDeductedEvent,
} from "@kmalae.ltd/library";

export class PaymentPointsDeductedPublisher extends Publisher<PaymentPointsDeductedEvent> {
	subject: Subjects.PaymentPointsDeducted = Subjects.PaymentPointsDeducted;
}
