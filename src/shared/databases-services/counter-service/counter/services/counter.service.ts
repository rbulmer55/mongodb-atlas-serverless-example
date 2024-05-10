import {Counter as Model, CounterModel} from '../model';
import {putEntity, getEntity} from '../../base-services';

async function incrementCounter(id: string): Promise<CounterModel> {
  try {
    //upsert allows for put
    console.log('Counter Service: IncrementCounter', id);
    return await putEntity(Model, {$inc: {count: 1}}, id, {upsert: true});
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getLatestCounter(): Promise<CounterModel> {
  try {
    // sort -1 gets latest record
    return await getEntity(Model, {}, {}, {sort: {updatedAt: -1}});
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const counterService = {
  incrementCounter,
  getLatestCounter,
};
