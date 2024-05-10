import { incrementCounter } from '@adapters/secondary/counter/counter-database.adapter';

export const incrementCounterUseCase = async () => {
	console.log('Business Logic: Adding one to counter');
	return await incrementCounter();
};
