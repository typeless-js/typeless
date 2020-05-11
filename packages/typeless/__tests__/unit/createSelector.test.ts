import { createSelector } from '../../src/createSelector';
import { StateGetter } from '../../src/types';

interface SampleState {
  n1?: number;
  n2?: number;
}
function createGetter<TState>(fn: () => TState) {
  return fn as StateGetter<TState>;
}

test('cache function invocations', () => {
  let defaultState = { n1: 1 };
  const fn1 = jest.fn((state: SampleState) => state.n1);
  const resultFn = jest.fn((n1: number) => n1 * 10);
  const getState = createGetter(() => defaultState);
  const selector = createSelector([getState, fn1], resultFn);
  let result = selector();
  expect(result).toEqual(10);
  expect(fn1).toHaveBeenCalledTimes(1);
  expect(resultFn).toHaveBeenCalledTimes(1);

  // call with the exactly the same object
  result = selector();
  expect(result).toEqual(10);
  expect(fn1).toHaveBeenCalledTimes(1);
  expect(resultFn).toHaveBeenCalledTimes(1);

  // different object, but the same arg
  defaultState = { n1: 1 };

  result = selector();
  expect(result).toEqual(10);
  expect(fn1).toHaveBeenCalledTimes(2);
  expect(resultFn).toHaveBeenCalledTimes(1);

  // different args
  defaultState = { n1: 2 };
  result = selector();
  expect(result).toEqual(20);
  expect(fn1).toHaveBeenCalledTimes(3);
  expect(resultFn).toHaveBeenCalledTimes(2);
});

test('recomputations', () => {
  let defaultState = { n1: 1 };
  const getState = createGetter(() => defaultState);
  const selector = createSelector([getState, state => state.n1], n1 => n1 * 10);

  expect(selector.recomputations()).toEqual(0);
  defaultState = { n1: 1 };
  selector();
  defaultState = { n1: 1 };
  selector();
  defaultState = { n1: 1 };
  selector();
  expect(selector.recomputations()).toEqual(1);
  defaultState = { n1: 2 };
  selector();
  expect(selector.recomputations()).toEqual(2);
  selector.resetRecomputations();
  expect(selector.recomputations()).toEqual(0);
});

test('resultFunc', () => {
  const defaultState = { n1: 1 };
  const getState = createGetter(() => defaultState);
  const selector = createSelector([getState, state => state.n1], n1 => n1 * 10);

  expect(selector.recomputations()).toEqual(0);
  expect(selector.resultFunc(1)).toEqual(10);
  expect(selector.recomputations()).toEqual(0);
});

test('getStateGetters', () => {
  const state1 = { n1: 1 };
  const state2 = { n2: 1 };
  const getState1 = createGetter(() => state1);
  const getState2 = createGetter(() => state2);
  const selector = createSelector(
    [getState1, state => state.n1],
    [getState1, state => state.n1],
    [getState2, state => state.n2],
    () => 1
  );
  const stateGetters = selector.getStateGetters();
  expect(stateGetters).toHaveLength(2);
  expect(stateGetters[0]()).toEqual(state1);
  expect(stateGetters[1]()).toEqual(state2);
});

test('getStateGetters nested', () => {
  const state1 = { n1: 1 };
  const state2 = { n2: 1 };
  const getState1 = createGetter(() => state1);
  const getState2 = createGetter(() => state2);
  const selector1 = createSelector(
    [getState1, state => state.n1],
    [getState1, state => state.n1],
    () => 1
  );
  const selector2 = createSelector(
    selector1,
    [getState2, state => state.n2],
    () => 1
  );
  const stateGetters = selector2.getStateGetters();
  expect(stateGetters).toHaveLength(2);
  expect(stateGetters[0]()).toEqual(state1);
  expect(stateGetters[1]()).toEqual(state2);
});

test('1 selector', () => {
  const defaultState = { n1: 1 };
  const getState = createGetter(() => defaultState);
  const selector = createSelector([getState, state => state.n1], n1 => n1 * 10);
  const result = selector();
  expect(result).toEqual(10);
});

test('2 selectors', () => {
  const stateA = { n1: 1 };
  const stateB = { n2: 2 };
  const getStateA = createGetter(() => stateA);
  const getStateB = createGetter(() => stateB);
  const selector = createSelector(
    [getStateA, state => state.n1],
    [getStateB, state => state.n2],
    (n1, n2) => {
      return n1 * 10 + n2 * 100;
    }
  );

  const result = selector();
  expect(result).toEqual(210);
});

test('3 selectors', () => {
  const stateA = { n1: 1 };
  const stateB = { n2: 2 };
  const stateC = { n1: 1, n2: 2 };
  const getStateA = createGetter(() => stateA);
  const getStateB = createGetter(() => stateB);
  const getStateC = createGetter(() => stateC);
  const selector = createSelector(
    [getStateA, state => state.n1],
    [getStateB, state => state.n2],
    [getStateC, state => state.n1 + state.n2],
    (n1, n2, n3) => {
      return n1 * 10 + n2 * 100 + n3 * 1000;
    }
  );

  const result = selector();
  expect(result).toEqual(3210);
});

test('composed', () => {
  let stateA = { n1: 1 };
  let stateB = { n2: 2 };
  const getStateA = createGetter(() => stateA);
  const getStateB = createGetter(() => stateB);
  const selectorA = createSelector([getStateA, state => state.n1], n1 => {
    return n1 * 10;
  });
  const selectorB = createSelector(
    selectorA,
    [getStateB, state => state.n2],
    (n1, n2) => {
      return n1 + n2 * 100;
    }
  );
  let result = selectorB();
  expect(result).toEqual(210);
  expect(selectorA.recomputations()).toEqual(1);
  expect(selectorB.recomputations()).toEqual(1);

  // change B
  stateB = { n2: 3 };
  result = selectorB();
  expect(result).toEqual(310);
  // A should not recompute
  expect(selectorA.recomputations()).toEqual(1);
  expect(selectorB.recomputations()).toEqual(2);

  // change A
  stateA = { n1: 2 };
  result = selectorB();
  expect(result).toEqual(320);
  // both should recompute
  expect(selectorA.recomputations()).toEqual(2);
  expect(selectorB.recomputations()).toEqual(3);
});
