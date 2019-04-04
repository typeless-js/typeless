import { RootReducer } from '../src/RootReducer';
import { Reducer, ActionLike } from '../src/types';

const createAddReducer = (initialValue: number) => (
  state = initialValue,
  action: ActionLike
) => {
  if (action.type === 'add') {
    return state + 1;
  }
  return state;
};

let rootReducer: RootReducer = null;
let reducer: Reducer<any> = null;

beforeEach(() => {
  rootReducer = new RootReducer();
  reducer = rootReducer.getReducer();
});

describe('no reducers', () => {
  test('should return an empty state', () => {
    const state = reducer({}, { type: 'action' });
    expect(state).toEqual({});
  });
});

describe('single reducer', () => {
  beforeEach(() => {
    rootReducer.addReducer(createAddReducer(1), ['foo']);
  });

  test('should handle actions', () => {
    rootReducer.addReducer(createAddReducer(1), ['foo']);
    let newState = reducer({}, { type: 'action' });
    expect(newState).toEqual({
      foo: 1,
    });
    newState = reducer(newState, { type: 'add' });
    expect(newState).toEqual({
      foo: 2,
    });
  });

  test('should remove the reducer', () => {
    let newState = reducer({}, { type: 'action' });
    expect(newState).toEqual({
      foo: 1,
    });
    rootReducer.removeReducer(['foo']);
    newState = reducer(newState, { type: 'add' });
    expect(newState).toEqual({
      foo: 1,
    });
  });
});

describe('multiple reducers', () => {
  beforeEach(() => {
    rootReducer.addReducer(createAddReducer(1), ['foo']);
    rootReducer.addReducer(createAddReducer(2), ['bar']);
  });

  test('should handle actions', () => {
    let newState = reducer({}, { type: 'action' });
    expect(newState).toEqual({
      foo: 1,
      bar: 2,
    });
    newState = reducer(newState, { type: 'add' });
    expect(newState).toEqual({
      foo: 2,
      bar: 3,
    });
  });
});

describe('deep reducer', () => {
  beforeEach(() => {
    rootReducer.addReducer(createAddReducer(1), ['deep', 'foo']);
  });

  test('should handle actions', () => {
    let newState = reducer({}, { type: 'action' });
    expect(newState).toEqual({
      deep: {
        foo: 1,
      },
    });
    newState = reducer(newState, { type: 'add' });
    expect(newState).toEqual({
      deep: {
        foo: 2,
      },
    });
  });

  test('remove reducer', () => {
    let newState = reducer({}, { type: 'action' });
    expect(newState).toEqual({
      deep: {
        foo: 1,
      },
    });
    rootReducer.removeReducer(['deep', 'foo']);
    newState = reducer(newState, { type: 'add' });
    expect(newState).toEqual({
      deep: {
        foo: 1,
      },
    });
  });

  test('ignore if remove unknown reducer', () => {
    let newState = reducer({}, { type: 'action' });
    expect(newState).toEqual({
      deep: {
        foo: 1,
      },
    });
    rootReducer.removeReducer(['unknown', 'foo']);
    newState = reducer(newState, { type: 'add' });
    expect(newState).toEqual({
      deep: {
        foo: 2,
      },
    });
  });
});

describe('multiple deep reducers', () => {
  beforeEach(() => {
    rootReducer.addReducer(createAddReducer(1), ['deep', 'foo']);
    rootReducer.addReducer(createAddReducer(2), ['deep', 'bar']);
  });

  test('should handle actions', () => {
    let newState = reducer({}, { type: 'action' });
    expect(newState).toEqual({
      deep: {
        foo: 1,
        bar: 2,
      },
    });
    newState = reducer(newState, { type: 'add' });
    expect(newState).toEqual({
      deep: {
        foo: 2,
        bar: 3,
      },
    });
  });
});
