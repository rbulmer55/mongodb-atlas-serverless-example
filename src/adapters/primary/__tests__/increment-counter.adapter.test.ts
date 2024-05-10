import * as incrementCounterUseCase from '@use-cases/counter/increment-counter.use-case';
import { incrementCounter } from '@adapters/primary/increment-counter.adapter';

let counter;
let spyfn: any;

describe('increment-counter.adapter', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		counter = {
			id: '12345',
			count: 3,
		};

		spyfn = jest
			.spyOn(incrementCounterUseCase, 'incrementCounterUseCase')
			.mockResolvedValue(counter);
	});

	test('Adapter returns the counter on success', async () => {
		await expect(incrementCounter()).resolves.toMatchSnapshot();
	});

	test('Adapter calls the use case', async () => {
		await incrementCounter();
		expect(spyfn).toHaveBeenCalledTimes(1);
	});
});
