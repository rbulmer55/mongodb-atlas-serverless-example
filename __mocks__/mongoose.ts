/* eslint-disable @typescript-eslint/explicit-function-return-type */
const mockMongoose: any = {
	aggregate: jest.fn(() => mockMongoose),
	count: jest.fn(() => 1),
	create: jest.fn(() => mockMongoose),
	findById: jest.fn(() => mockMongoose),
	findByIdAndRemove: jest.fn(() => mockMongoose),
	findOne: jest.fn(() => mockMongoose),
	find: jest.fn(() => mockMongoose),
	skip: jest.fn(() => mockMongoose),
	lean: jest.fn(() => mockMongoose),
	limit: jest.fn(() => mockMongoose),
	sort: jest.fn(() => mockMongoose),
	findOneAndUpdate: jest.fn(() => mockMongoose),
	remove: jest.fn(() => mockMongoose),
	save: jest.fn(() => mockMongoose),
	update: jest.fn(() => mockMongoose),
	updateMany: jest.fn(() => mockMongoose),
};

export const model = function model() {
	return mockMongoose;
};

model.aggregate = mockMongoose.aggregate;
model.create = mockMongoose.create;
model.update = mockMongoose.update;
model.updateMany = mockMongoose.updateMany;
model.save = mockMongoose.save;
model.remove = mockMongoose.remove;
model.findById = mockMongoose.findById;
model.findByIdAndRemove = mockMongoose.findByIdAndRemove;
model.findOne = mockMongoose.findOne;
model.find = mockMongoose.find;
model.skip = mockMongoose.skip;
model.lean = mockMongoose.lean;
model.limit = mockMongoose.limit;
model.sort = mockMongoose.sort;
model.findOneAndUpdate = mockMongoose.findOneAndUpdate;
model.create = mockMongoose.create;
model.count = mockMongoose.count;

export const Schema = jest.fn(() => ({
	index: jest.fn(),
	pre: jest.fn(),
	virtual: jest.fn(() => ({
		get: jest.fn(),
	})),
}));

export const mongoose = function mongoose() {
	return {
		connect: jest.fn(),
		Schema: jest.fn(() => ({
			index: jest.fn(),
			pre: jest.fn(),
			virtual: jest.fn(() => ({
				get: jest.fn(),
			})),
		})),
		model: jest.fn(() => model),
		models: {
			Message: {
				findById: jest.fn(),
			},
		},
	};
};
