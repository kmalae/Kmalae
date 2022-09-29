import {
	Listener,
	Subjects,
	LiftRequestCreatedEvent,
	BadRequestError,
} from '@kmalae.ltd/library';
import { Message } from 'node-nats-streaming';
import { LiftRequest } from '../../../models/lift-request';
import { queueGroupName } from '../queue-group-name';

export class LiftRequestCreatedListener extends Listener<LiftRequestCreatedEvent> {
	subject: Subjects.LiftRequestCreated = Subjects.LiftRequestCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: LiftRequestCreatedEvent['data'], msg: Message) {
		const {
			id,
			user,
			vehicle,
			currentLocation,
			destination,
			timeOfDeparture,
			version,
		} = data;

		const liftRequest = LiftRequest.build({
			_id: id,
			user,
			vehicle,
			currentLocation,
			destination,
			timeOfDeparture,
			version,
		});

		try {
			await liftRequest.save();

			msg.ack();
		} catch (error) {
			console.log(error);
			throw new BadRequestError('Lift request not updated: Match');
		}
	}
}
