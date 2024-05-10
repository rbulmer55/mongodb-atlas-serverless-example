import {Counter} from '../counter.model';

let counterModel: any;

describe('Counter model', () => {
  beforeEach(() => {
    counterModel = {
      _id: '851e52e0-9444-4436-8f3d-6ffe47580458',
      count: 3,
    };
  });

  test('should default the properties', () => {
    const counter = new Counter();
    expect(counter).toMatchSnapshot();
  });

  test('should create when supplied properties', () => {
    const counter = new Counter(counterModel);
    expect(counter).toMatchSnapshot();
  });

  describe('validate', () => {
    test('should validate id', () => {
      counterModel._id = 'invalid-not-a-uuid';
      const counter = new Counter(counterModel);
      const error = counter.validateSync();
      expect(error?.errors).toMatchSnapshot();
    });

    test('should create id', () => {
      delete counterModel._id;
      const counter = new Counter(counterModel);
      expect(counter.id).not.toEqual(counterModel._id);
      expect(counter).toMatchSnapshot();
    });
  });
});
