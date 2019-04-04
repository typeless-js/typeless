// Inspired by https://github.com/reduxjs/reselect/blob/master/src/index.js
// MIT

import { DefaultState } from './types';

export type Selector<S, R> = (state: S) => R;

export type OutputSelector<S, R, C> = Selector<S, R> & {
  resultFunc: C;
  recomputations: () => number;
  resetRecomputations: () => number;
};

function shallowEqual(a: any[] | null, b: any[] | null) {
  if (!a || !b || a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

function memoize(fn: (...args: any[]) => any) {
  let lastArgs: any[] = null;
  let lastResult: any[];

  return (...args: any[]) => {
    if (!shallowEqual(args, lastArgs)) {
      lastResult = fn(...args);
    }
    lastArgs = args;
    return lastResult;
  };
}

/** START AUTOMATICALLY GENERATED */

export function createSelector<T1, R, S = DefaultState>(
  selectors: [Selector<S, T1>],
  fn: (arg1: T1) => R
): OutputSelector<S, R, (arg1: T1) => R>;

export function createSelector<T1, T2, R, S = DefaultState>(
  selectors: [Selector<S, T1>, Selector<S, T2>],
  fn: (arg1: T1, arg2: T2) => R
): OutputSelector<S, R, (arg1: T1, arg2: T2) => R>;

export function createSelector<T1, T2, T3, R, S = DefaultState>(
  selectors: [Selector<S, T1>, Selector<S, T2>, Selector<S, T3>],
  fn: (arg1: T1, arg2: T2, arg3: T3) => R
): OutputSelector<S, R, (arg1: T1, arg2: T2, arg3: T3) => R>;

export function createSelector<T1, T2, T3, T4, R, S = DefaultState>(
  selectors: [
    Selector<S, T1>,
    Selector<S, T2>,
    Selector<S, T3>,
    Selector<S, T4>
  ],
  fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R
): OutputSelector<S, R, (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R>;

export function createSelector<T1, T2, T3, T4, T5, R, S = DefaultState>(
  selectors: [
    Selector<S, T1>,
    Selector<S, T2>,
    Selector<S, T3>,
    Selector<S, T4>,
    Selector<S, T5>
  ],
  fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => R
): OutputSelector<
  S,
  R,
  (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => R
>;

export function createSelector<T1, T2, T3, T4, T5, T6, R, S = DefaultState>(
  selectors: [
    Selector<S, T1>,
    Selector<S, T2>,
    Selector<S, T3>,
    Selector<S, T4>,
    Selector<S, T5>,
    Selector<S, T6>
  ],
  fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6) => R
): OutputSelector<
  S,
  R,
  (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6) => R
>;

export function createSelector<T1, T2, T3, T4, T5, T6, T7, R, S = DefaultState>(
  selectors: [
    Selector<S, T1>,
    Selector<S, T2>,
    Selector<S, T3>,
    Selector<S, T4>,
    Selector<S, T5>,
    Selector<S, T6>,
    Selector<S, T7>
  ],
  fn: (
    arg1: T1,
    arg2: T2,
    arg3: T3,
    arg4: T4,
    arg5: T5,
    arg6: T6,
    arg7: T7
  ) => R
): OutputSelector<
  S,
  R,
  (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7) => R
>;

export function createSelector<
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  R,
  S = DefaultState
>(
  selectors: [
    Selector<S, T1>,
    Selector<S, T2>,
    Selector<S, T3>,
    Selector<S, T4>,
    Selector<S, T5>,
    Selector<S, T6>,
    Selector<S, T7>,
    Selector<S, T8>
  ],
  fn: (
    arg1: T1,
    arg2: T2,
    arg3: T3,
    arg4: T4,
    arg5: T5,
    arg6: T6,
    arg7: T7,
    arg8: T8
  ) => R
): OutputSelector<
  S,
  R,
  (
    arg1: T1,
    arg2: T2,
    arg3: T3,
    arg4: T4,
    arg5: T5,
    arg6: T6,
    arg7: T7,
    arg8: T8
  ) => R
>;

export function createSelector<
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  R,
  S = DefaultState
>(
  selectors: [
    Selector<S, T1>,
    Selector<S, T2>,
    Selector<S, T3>,
    Selector<S, T4>,
    Selector<S, T5>,
    Selector<S, T6>,
    Selector<S, T7>,
    Selector<S, T8>,
    Selector<S, T9>
  ],
  fn: (
    arg1: T1,
    arg2: T2,
    arg3: T3,
    arg4: T4,
    arg5: T5,
    arg6: T6,
    arg7: T7,
    arg8: T8,
    arg9: T9
  ) => R
): OutputSelector<
  S,
  R,
  (
    arg1: T1,
    arg2: T2,
    arg3: T3,
    arg4: T4,
    arg5: T5,
    arg6: T6,
    arg7: T7,
    arg8: T8,
    arg9: T9
  ) => R
>;

export function createSelector<
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10,
  R,
  S = DefaultState
>(
  selectors: [
    Selector<S, T1>,
    Selector<S, T2>,
    Selector<S, T3>,
    Selector<S, T4>,
    Selector<S, T5>,
    Selector<S, T6>,
    Selector<S, T7>,
    Selector<S, T8>,
    Selector<S, T9>,
    Selector<S, T10>
  ],
  fn: (
    arg1: T1,
    arg2: T2,
    arg3: T3,
    arg4: T4,
    arg5: T5,
    arg6: T6,
    arg7: T7,
    arg8: T8,
    arg9: T9,
    arg10: T10
  ) => R
): OutputSelector<
  S,
  R,
  (
    arg1: T1,
    arg2: T2,
    arg3: T3,
    arg4: T4,
    arg5: T5,
    arg6: T6,
    arg7: T7,
    arg8: T8,
    arg9: T9,
    arg10: T10
  ) => R
>;

export function createSelector<
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10,
  T11,
  R,
  S = DefaultState
>(
  selectors: [
    Selector<S, T1>,
    Selector<S, T2>,
    Selector<S, T3>,
    Selector<S, T4>,
    Selector<S, T5>,
    Selector<S, T6>,
    Selector<S, T7>,
    Selector<S, T8>,
    Selector<S, T9>,
    Selector<S, T10>,
    Selector<S, T11>
  ],
  fn: (
    arg1: T1,
    arg2: T2,
    arg3: T3,
    arg4: T4,
    arg5: T5,
    arg6: T6,
    arg7: T7,
    arg8: T8,
    arg9: T9,
    arg10: T10,
    arg11: T11
  ) => R
): OutputSelector<
  S,
  R,
  (
    arg1: T1,
    arg2: T2,
    arg3: T3,
    arg4: T4,
    arg5: T5,
    arg6: T6,
    arg7: T7,
    arg8: T8,
    arg9: T9,
    arg10: T10,
    arg11: T11
  ) => R
>;

export function createSelector<
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10,
  T11,
  T12,
  R,
  S = DefaultState
>(
  selectors: [
    Selector<S, T1>,
    Selector<S, T2>,
    Selector<S, T3>,
    Selector<S, T4>,
    Selector<S, T5>,
    Selector<S, T6>,
    Selector<S, T7>,
    Selector<S, T8>,
    Selector<S, T9>,
    Selector<S, T10>,
    Selector<S, T11>,
    Selector<S, T12>
  ],
  fn: (
    arg1: T1,
    arg2: T2,
    arg3: T3,
    arg4: T4,
    arg5: T5,
    arg6: T6,
    arg7: T7,
    arg8: T8,
    arg9: T9,
    arg10: T10,
    arg11: T11,
    arg12: T12
  ) => R
): OutputSelector<
  S,
  R,
  (
    arg1: T1,
    arg2: T2,
    arg3: T3,
    arg4: T4,
    arg5: T5,
    arg6: T6,
    arg7: T7,
    arg8: T8,
    arg9: T9,
    arg10: T10,
    arg11: T11,
    arg12: T12
  ) => R
>;

/** END AUTOMATICALLY GENERATED */

export function createSelector(
  selectors: any[],
  resultFunc: (...args: any[]) => any
) {
  let recomputations = 0;
  const memoizedFn = memoize((...args: any[]) => {
    recomputations++;
    return resultFunc(...args);
  });

  const ret = memoize((state: any) => {
    const params: any[] = [];
    for (const selector of selectors) {
      params.push(selector(state));
    }
    return memoizedFn(...params);
  }) as OutputSelector<any, any, () => any>;

  ret.resultFunc = resultFunc;
  ret.resetRecomputations = () => (recomputations = 0);
  ret.recomputations = () => recomputations;

  return ret;
}
