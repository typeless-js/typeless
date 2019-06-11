import { StateGetter } from './types';
import { memoize } from './utils';

export type InputSelector<S, R> = [StateGetter<S>, (state: S) => R];

export interface Selector<R, C> {
  (): R;
  resultFunc: C;
  recomputations: () => number;
  resetRecomputations: () => number;
  getStateGetters: () => Array<StateGetter<any>>;
}

/* START AUTOMATICALLY GENERATED */

export function createSelector<S1, R1, R>(
  selector1: Selector<R1, any> | InputSelector<S1, R1>,
  fn: (arg1: R1) => R
): Selector<R, (arg1: R1) => R>;

export function createSelector<S1, R1, S2, R2, R>(
  selector1: Selector<R1, any> | InputSelector<S1, R1>,
  selector2: Selector<R2, any> | InputSelector<S2, R2>,
  fn: (arg1: R1, arg2: R2) => R
): Selector<R, (arg1: R1, arg2: R2) => R>;

export function createSelector<S1, R1, S2, R2, S3, R3, R>(
  selector1: Selector<R1, any> | InputSelector<S1, R1>,
  selector2: Selector<R2, any> | InputSelector<S2, R2>,
  selector3: Selector<R3, any> | InputSelector<S3, R3>,
  fn: (arg1: R1, arg2: R2, arg3: R3) => R
): Selector<R, (arg1: R1, arg2: R2, arg3: R3) => R>;

export function createSelector<S1, R1, S2, R2, S3, R3, S4, R4, R>(
  selector1: Selector<R1, any> | InputSelector<S1, R1>,
  selector2: Selector<R2, any> | InputSelector<S2, R2>,
  selector3: Selector<R3, any> | InputSelector<S3, R3>,
  selector4: Selector<R4, any> | InputSelector<S4, R4>,
  fn: (arg1: R1, arg2: R2, arg3: R3, arg4: R4) => R
): Selector<R, (arg1: R1, arg2: R2, arg3: R3, arg4: R4) => R>;

export function createSelector<S1, R1, S2, R2, S3, R3, S4, R4, S5, R5, R>(
  selector1: Selector<R1, any> | InputSelector<S1, R1>,
  selector2: Selector<R2, any> | InputSelector<S2, R2>,
  selector3: Selector<R3, any> | InputSelector<S3, R3>,
  selector4: Selector<R4, any> | InputSelector<S4, R4>,
  selector5: Selector<R5, any> | InputSelector<S5, R5>,
  fn: (arg1: R1, arg2: R2, arg3: R3, arg4: R4, arg5: R5) => R
): Selector<R, (arg1: R1, arg2: R2, arg3: R3, arg4: R4, arg5: R5) => R>;

export function createSelector<
  S1,
  R1,
  S2,
  R2,
  S3,
  R3,
  S4,
  R4,
  S5,
  R5,
  S6,
  R6,
  R
>(
  selector1: Selector<R1, any> | InputSelector<S1, R1>,
  selector2: Selector<R2, any> | InputSelector<S2, R2>,
  selector3: Selector<R3, any> | InputSelector<S3, R3>,
  selector4: Selector<R4, any> | InputSelector<S4, R4>,
  selector5: Selector<R5, any> | InputSelector<S5, R5>,
  selector6: Selector<R6, any> | InputSelector<S6, R6>,
  fn: (arg1: R1, arg2: R2, arg3: R3, arg4: R4, arg5: R5, arg6: R6) => R
): Selector<
  R,
  (arg1: R1, arg2: R2, arg3: R3, arg4: R4, arg5: R5, arg6: R6) => R
>;

export function createSelector<
  S1,
  R1,
  S2,
  R2,
  S3,
  R3,
  S4,
  R4,
  S5,
  R5,
  S6,
  R6,
  S7,
  R7,
  R
>(
  selector1: Selector<R1, any> | InputSelector<S1, R1>,
  selector2: Selector<R2, any> | InputSelector<S2, R2>,
  selector3: Selector<R3, any> | InputSelector<S3, R3>,
  selector4: Selector<R4, any> | InputSelector<S4, R4>,
  selector5: Selector<R5, any> | InputSelector<S5, R5>,
  selector6: Selector<R6, any> | InputSelector<S6, R6>,
  selector7: Selector<R7, any> | InputSelector<S7, R7>,
  fn: (
    arg1: R1,
    arg2: R2,
    arg3: R3,
    arg4: R4,
    arg5: R5,
    arg6: R6,
    arg7: R7
  ) => R
): Selector<
  R,
  (arg1: R1, arg2: R2, arg3: R3, arg4: R4, arg5: R5, arg6: R6, arg7: R7) => R
>;

export function createSelector<
  S1,
  R1,
  S2,
  R2,
  S3,
  R3,
  S4,
  R4,
  S5,
  R5,
  S6,
  R6,
  S7,
  R7,
  S8,
  R8,
  R
>(
  selector1: Selector<R1, any> | InputSelector<S1, R1>,
  selector2: Selector<R2, any> | InputSelector<S2, R2>,
  selector3: Selector<R3, any> | InputSelector<S3, R3>,
  selector4: Selector<R4, any> | InputSelector<S4, R4>,
  selector5: Selector<R5, any> | InputSelector<S5, R5>,
  selector6: Selector<R6, any> | InputSelector<S6, R6>,
  selector7: Selector<R7, any> | InputSelector<S7, R7>,
  selector8: Selector<R8, any> | InputSelector<S8, R8>,
  fn: (
    arg1: R1,
    arg2: R2,
    arg3: R3,
    arg4: R4,
    arg5: R5,
    arg6: R6,
    arg7: R7,
    arg8: R8
  ) => R
): Selector<
  R,
  (
    arg1: R1,
    arg2: R2,
    arg3: R3,
    arg4: R4,
    arg5: R5,
    arg6: R6,
    arg7: R7,
    arg8: R8
  ) => R
>;

export function createSelector<
  S1,
  R1,
  S2,
  R2,
  S3,
  R3,
  S4,
  R4,
  S5,
  R5,
  S6,
  R6,
  S7,
  R7,
  S8,
  R8,
  S9,
  R9,
  R
>(
  selector1: Selector<R1, any> | InputSelector<S1, R1>,
  selector2: Selector<R2, any> | InputSelector<S2, R2>,
  selector3: Selector<R3, any> | InputSelector<S3, R3>,
  selector4: Selector<R4, any> | InputSelector<S4, R4>,
  selector5: Selector<R5, any> | InputSelector<S5, R5>,
  selector6: Selector<R6, any> | InputSelector<S6, R6>,
  selector7: Selector<R7, any> | InputSelector<S7, R7>,
  selector8: Selector<R8, any> | InputSelector<S8, R8>,
  selector9: Selector<R9, any> | InputSelector<S9, R9>,
  fn: (
    arg1: R1,
    arg2: R2,
    arg3: R3,
    arg4: R4,
    arg5: R5,
    arg6: R6,
    arg7: R7,
    arg8: R8,
    arg9: R9
  ) => R
): Selector<
  R,
  (
    arg1: R1,
    arg2: R2,
    arg3: R3,
    arg4: R4,
    arg5: R5,
    arg6: R6,
    arg7: R7,
    arg8: R8,
    arg9: R9
  ) => R
>;

export function createSelector<
  S1,
  R1,
  S2,
  R2,
  S3,
  R3,
  S4,
  R4,
  S5,
  R5,
  S6,
  R6,
  S7,
  R7,
  S8,
  R8,
  S9,
  R9,
  S10,
  R10,
  R
>(
  selector1: Selector<R1, any> | InputSelector<S1, R1>,
  selector2: Selector<R2, any> | InputSelector<S2, R2>,
  selector3: Selector<R3, any> | InputSelector<S3, R3>,
  selector4: Selector<R4, any> | InputSelector<S4, R4>,
  selector5: Selector<R5, any> | InputSelector<S5, R5>,
  selector6: Selector<R6, any> | InputSelector<S6, R6>,
  selector7: Selector<R7, any> | InputSelector<S7, R7>,
  selector8: Selector<R8, any> | InputSelector<S8, R8>,
  selector9: Selector<R9, any> | InputSelector<S9, R9>,
  selector10: Selector<R10, any> | InputSelector<S10, R10>,
  fn: (
    arg1: R1,
    arg2: R2,
    arg3: R3,
    arg4: R4,
    arg5: R5,
    arg6: R6,
    arg7: R7,
    arg8: R8,
    arg9: R9,
    arg10: R10
  ) => R
): Selector<
  R,
  (
    arg1: R1,
    arg2: R2,
    arg3: R3,
    arg4: R4,
    arg5: R5,
    arg6: R6,
    arg7: R7,
    arg8: R8,
    arg9: R9,
    arg10: R10
  ) => R
>;

export function createSelector<
  S1,
  R1,
  S2,
  R2,
  S3,
  R3,
  S4,
  R4,
  S5,
  R5,
  S6,
  R6,
  S7,
  R7,
  S8,
  R8,
  S9,
  R9,
  S10,
  R10,
  S11,
  R11,
  R
>(
  selector1: Selector<R1, any> | InputSelector<S1, R1>,
  selector2: Selector<R2, any> | InputSelector<S2, R2>,
  selector3: Selector<R3, any> | InputSelector<S3, R3>,
  selector4: Selector<R4, any> | InputSelector<S4, R4>,
  selector5: Selector<R5, any> | InputSelector<S5, R5>,
  selector6: Selector<R6, any> | InputSelector<S6, R6>,
  selector7: Selector<R7, any> | InputSelector<S7, R7>,
  selector8: Selector<R8, any> | InputSelector<S8, R8>,
  selector9: Selector<R9, any> | InputSelector<S9, R9>,
  selector10: Selector<R10, any> | InputSelector<S10, R10>,
  selector11: Selector<R11, any> | InputSelector<S11, R11>,
  fn: (
    arg1: R1,
    arg2: R2,
    arg3: R3,
    arg4: R4,
    arg5: R5,
    arg6: R6,
    arg7: R7,
    arg8: R8,
    arg9: R9,
    arg10: R10,
    arg11: R11
  ) => R
): Selector<
  R,
  (
    arg1: R1,
    arg2: R2,
    arg3: R3,
    arg4: R4,
    arg5: R5,
    arg6: R6,
    arg7: R7,
    arg8: R8,
    arg9: R9,
    arg10: R10,
    arg11: R11
  ) => R
>;

export function createSelector<
  S1,
  R1,
  S2,
  R2,
  S3,
  R3,
  S4,
  R4,
  S5,
  R5,
  S6,
  R6,
  S7,
  R7,
  S8,
  R8,
  S9,
  R9,
  S10,
  R10,
  S11,
  R11,
  S12,
  R12,
  R
>(
  selector1: Selector<R1, any> | InputSelector<S1, R1>,
  selector2: Selector<R2, any> | InputSelector<S2, R2>,
  selector3: Selector<R3, any> | InputSelector<S3, R3>,
  selector4: Selector<R4, any> | InputSelector<S4, R4>,
  selector5: Selector<R5, any> | InputSelector<S5, R5>,
  selector6: Selector<R6, any> | InputSelector<S6, R6>,
  selector7: Selector<R7, any> | InputSelector<S7, R7>,
  selector8: Selector<R8, any> | InputSelector<S8, R8>,
  selector9: Selector<R9, any> | InputSelector<S9, R9>,
  selector10: Selector<R10, any> | InputSelector<S10, R10>,
  selector11: Selector<R11, any> | InputSelector<S11, R11>,
  selector12: Selector<R12, any> | InputSelector<S12, R12>,
  fn: (
    arg1: R1,
    arg2: R2,
    arg3: R3,
    arg4: R4,
    arg5: R5,
    arg6: R6,
    arg7: R7,
    arg8: R8,
    arg9: R9,
    arg10: R10,
    arg11: R11,
    arg12: R12
  ) => R
): Selector<
  R,
  (
    arg1: R1,
    arg2: R2,
    arg3: R3,
    arg4: R4,
    arg5: R5,
    arg6: R6,
    arg7: R7,
    arg8: R8,
    arg9: R9,
    arg10: R10,
    arg11: R11,
    arg12: R12
  ) => R
>;

/* END AUTOMATICALLY GENERATED */

export function createSelector(...args: any[]) {
  const selectors: Array<
    Selector<any, any> | InputSelector<any, any>
  > = args.slice(0, args.length - 1);
  const resultFunc: (...args: any[]) => any = args[args.length - 1];
  let recomputations = 0;
  const memoizedFn = memoize((...fnArgs: any[]) => {
    recomputations++;
    return resultFunc(...fnArgs);
  });

  const memoizedSelectors: Array<(...args: any[]) => any> = [];

  const ret = () => {
    const params: any[] = [];
    for (let i = 0; i < selectors.length; i++) {
      const selector = selectors[i];
      if (Array.isArray(selector)) {
        const [getState, map] = selector;
        if (!memoizedSelectors[i]) {
          memoizedSelectors[i] = memoize(map);
        }
        params.push(memoizedSelectors[i](getState()));
      } else {
        params.push(selector());
      }
    }
    return memoizedFn(...params);
  };

  const stateGetters = extractStateGetters(selectors);
  ret.resultFunc = resultFunc;
  ret.resetRecomputations = () => (recomputations = 0);
  ret.recomputations = () => recomputations;
  ret.getStateGetters = () => stateGetters;

  return ret;
}

function extractStateGetters(
  selectors: Array<Selector<any, any> | InputSelector<any, any>>
) {
  const gettersSet = new Set();
  const stateGetters: Array<StateGetter<any>> = [];
  const checkAdd = (stateGetter: StateGetter<any>) => {
    if (!gettersSet.has(stateGetter)) {
      stateGetters.push(stateGetter);
      gettersSet.add(stateGetter);
    }
  };
  selectors.forEach(selector => {
    if (Array.isArray(selector)) {
      checkAdd(selector[0]);
    } else {
      selector.getStateGetters().forEach(checkAdd);
    }
  });
  return stateGetters;
}
