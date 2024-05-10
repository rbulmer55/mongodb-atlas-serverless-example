import * as incrementCounterUseCase from '@use-cases/counter/increment-counter.use-case';
import {incrementCounter} from '@adapters/primary/increment-counter.adapter';

let counter;

describe('increment-counter.adapter', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    counter = {
      id: '12345',
      count: 3,
    };

    jest
      .spyOn(incrementCounterUseCase, 'incrementCounterUseCase')
      .mockResolvedValue(counter);
  });

  test('Adapter returns the counter on success', async () => {
    await expect(incrementCounter()).resolves.toMatchSnapshot();
  });
});
