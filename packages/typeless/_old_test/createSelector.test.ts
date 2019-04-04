import { createSelector } from '../src/createSelector';

interface SampleState {
  n1?: number;
  n2?: number;
}

function getDefaultSelector() {
  return createSelector(
    [(state: SampleState) => state.n1],
    n1 => n1 * 10
  );
}

test('cache function invocations', () => {
  const fn1 = jest.fn((state: SampleState) => state.n1);
  const resultFn = jest.fn((n1: number) => n1 * 10);
  const selector = createSelector(
    [fn1],
    resultFn
  );
  const defaultState = { n1: 1 };
  let result = selector(defaultState);
  expect(result).toEqual(10);
  expect(fn1).toHaveBeenCalledTimes(1);
  expect(resultFn).toHaveBeenCalledTimes(1);

  // call with the exactly the same object
  result = selector(defaultState);
  expect(result).toEqual(10);
  expect(fn1).toHaveBeenCalledTimes(1);
  expect(resultFn).toHaveBeenCalledTimes(1);

  // different object, but the same arg
  result = selector({ n1: 1 });
  expect(result).toEqual(10);
  expect(fn1).toHaveBeenCalledTimes(2);
  expect(resultFn).toHaveBeenCalledTimes(1);

  // different args
  result = selector({ n1: 2 });
  expect(result).toEqual(20);
  expect(fn1).toHaveBeenCalledTimes(3);
  expect(resultFn).toHaveBeenCalledTimes(2);
});

test('recomputations', () => {
  const selector = getDefaultSelector();

  expect(selector.recomputations()).toEqual(0);
  selector({ n1: 1 });
  selector({ n1: 1 });
  selector({ n1: 1 });
  expect(selector.recomputations()).toEqual(1);
  selector({ n1: 2 });
  expect(selector.recomputations()).toEqual(2);
  selector.resetRecomputations();
  expect(selector.recomputations()).toEqual(0);
});

test('resultFunc', () => {
  const selector = getDefaultSelector();

  expect(selector.recomputations()).toEqual(0);
  expect(selector.resultFunc(1)).toEqual(10);
  expect(selector.recomputations()).toEqual(0);
});

test('1 selector', () => {
  const selector = getDefaultSelector();
  const result = selector({ n1: 1 });
  expect(result).toEqual(10);
});

test('2 selectors', () => {
  const selector = createSelector(
    [(state: SampleState) => state.n1, state => state.n2],
    (n1, n2) => {
      return n1 * 10 + n2 * 100;
    }
  );

  const result = selector({ n1: 1, n2: 2 });
  expect(result).toEqual(210);
});

test('3 selectors', () => {
  const selector = createSelector(
    [
      (state: SampleState) => state.n1,
      state => state.n2,
      state => state.n1 + state.n2,
    ],
    (n1, n2, n3) => {
      return n1 * 10 + n2 * 100 + n3 * 1000;
    }
  );

  const result = selector({ n1: 1, n2: 2 });
  expect(result).toEqual(3210);
});
