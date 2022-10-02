import {
	Listener,
	Subjects,
	LiftRequestUpdatedEvent,
	BadRequestError,
} from '@kmalae.ltd/library';
import { Message } from 'node-nats-streaming';
import { LiftRequest } from '../../../models/lift-request';
import { queueGroupName } from '../queue-group-name';

export class LiftRequestUpdatedListener extends Listener<LiftRequestUpdatedEvent> {
	subject: Subjects.LiftRequestUpdated = Subjects.LiftRequestUpdated;
	queueGroupName = queueGroupName;

	async onMessage(data: LiftRequestUpdatedEvent['data'], msg: Message) {
		const {
			id,
			user,
			vehicle,
			currentLocation,
			destination,
			timeOfDeparture,
			version,
		} = data;

		const previousVersion = version - 1;
		const existingLiftRequest = await LiftRequest.findOne({
			_id: id,
			version: previousVersion,
		});

		if (!existingLiftRequest) {
			throw new BadRequestError('Lift request not found: Match');
		}

		existingLiftRequest.set({
			_id: id,
			user,
			vehicle,
			currentLocation,
			destination,
			timeOfDeparture,
			version,
		});

		try {
			await existingLiftRequest.save();

			msg.ack();
		} catch (error) {
			console.log(error);
			throw new BadRequestError('Lift request not updated: Match');
		}
	}
}
