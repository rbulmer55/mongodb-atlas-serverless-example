import {CounterDto} from '@dto/counter';
import {incrementCounterUseCase} from '@use-cases/counter/increment-counter.use-case';

export const incrementCounter = async () => {
  console.log('Primary Adapter: Increment my counter please');
  return (await incrementCounterUseCase()) as CounterDto;
};
