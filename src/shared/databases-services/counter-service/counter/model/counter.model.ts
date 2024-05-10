import { Schema, model, Document } from 'mongoose';
import { _id, idVirtual } from '../../helpers/schema-constants';

const options = {
	strict: true,
	timestamps: true,
	toJson: {
		virtuals: true,
	},
};

export interface CounterModel extends Document {
	_id: string;
	count: number;
}

const name = 'Counters';
const counterProperties = {
	_id,
	count: {
		type: Number,
		required: true,
		public: true,
		default: 1,
	},
};

const schema = new Schema(counterProperties, options);

schema.virtual('id').get(idVirtual);

export const Counter = model<CounterModel>(name, schema);
