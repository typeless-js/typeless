import { createDeps } from '../src/createDeps';
import { StateGetter } from '../src/types';

let stateA = { n: 1 };
let stateB = { n: 2 };

const getStateA = (() => stateA) as StateGetter<typeof stateA>;
const getStateB = (() => stateB) as StateGetter<typeof stateB>;

beforeEach(() => {
  stateA = { n: 1 };
  stateB = { n: 2 };
});

function getDefaultSelector() {
  const deps = createDeps({ a: getStateA });
  return deps.createSelector(
    state => state.a.n,
    n => n * 10
  );
}

describe('createSelector', () => {
  test('cache function invocations', () => {
    const deps = createDeps({ a: getStateA, b: getStateB });
    const fn1 = jest.fn();
    const resultFn = jest.fn((a: number) => a * 10);
    const selector = deps.createSelector(
      state => {
        fn1();
        return state.a.n;
      },
      resultFn
    );
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
    stateA = { n: 1 };
    result = selector();
    expect(result).toEqual(10);
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(resultFn).toHaveBeenCalledTimes(1);

    // different args
    stateA = { n: 2 };
    result = selector();
    expect(result).toEqual(20);
    expect(fn1).toHaveBeenCalledTimes(3);
    expect(resultFn).toHaveBeenCalledTimes(2);
  });

  test('recomputations', () => {
    const selector = getDefaultSelector();

    expect(selector.recomputations()).toEqual(0);
    stateA = { n: 1 };
    selector();
    stateA = { n: 1 };
    selector();
    stateA = { n: 1 };
    selector();
    expect(selector.recomputations()).toEqual(1);
    stateA = { n: 2 };
    selector();
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
    const result = selector();
    expect(result).toEqual(10);
  });

  test('2 selectors', () => {
    const deps = createDeps({ a: getStateA, b: getStateB });
    const selector = deps.createSelector(
      state => state.a.n,
      state => state.b.n,
      (n1, n2) => {
        return n1 * 10 + n2 * 100;
      }
    );
    const result = selector();
    expect(result).toEqual(210);
  });

  test('3 selectors', () => {
    const stateC = { n: 3 };

    const getStateC = (() => stateC) as StateGetter<typeof stateC>;
    const deps = createDeps({ a: getStateA, b: getStateB, c: getStateC });
    const selector = deps.createSelector(
      state => state.a.n,
      state => state.b.n,
      state => state.c.n,
      (n1, n2, n3) => {
        return n1 * 10 + n2 * 100 + n3 * 1000;
      }
    );

    const result = selector();
    expect(result).toEqual(3210);
  });
});
