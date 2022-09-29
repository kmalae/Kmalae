import {
	Listener,
	Subjects,
	LiftRequestCancelledEvent,
	BadRequestError,
	LiftRequestStatus,
} from '@kmalae.ltd/library';
import { Message } from 'node-nats-streaming';
import { LiftRequest } from '../../../models/lift-request';
import { queueGroupName } from '../queue-group-name';

export class LiftRequestCancelledListener extends Listener<LiftRequestCancelledEvent> {
	subject: Subjects.LiftRequestCancelled = Subjects.LiftRequestCancelled;
	queueGroupName = queueGroupName;

	async onMessage(data: LiftRequestCancelledEvent['data'], msg: Message) {
		const { id, user, version } = data;

		const existingLiftRequest = await LiftRequest.findOne({
			_id: id,
			user,
			version: version - 1,
		});

		if (!existingLiftRequest) {
			throw new BadRequestError('Lift request not found: Match');
		}

		existingLiftRequest.set({
			status: LiftRequestStatus.Cancelled,
		});

		try {
			await existingLiftRequest.save();

			msg.ack();
		} catch (error) {
			console.log(error);
			throw new BadRequestError('Lift request not cancelled: Match');
		}
	}
}
