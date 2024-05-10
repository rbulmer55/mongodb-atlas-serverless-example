import { Counter } from '@models/counter';
import { connect } from '@shared/databases-services/counter-service/connection';
import { counterService } from '@shared/databases-services/counter-service/counter/services';
import { v4 as uuid } from 'uuid';

export const incrementCounter = async () => {
	console.log('Secondary Adapter: Connecting to database');
	await connect();

	console.log('Secondary Adapter: Retrieving counter Id');
	const counter = await counterService.getLatestCounter();

	console.log('Secondary Adapter: Incrementing counter');
	const updatedCounter = await counterService.incrementCounter(
		counter ? counter.id : uuid()
	);
	console.log('Counter Updated', updatedCounter);
	return updatedCounter as Counter;
};
