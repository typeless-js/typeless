import { StateGetter } from './types';
import { memoize, shallowEqual } from './utils';
import { useMappedState } from './useMappedState';

export type DepsSelector<S, R> = (state: S) => R;

export type DepsOutputSelector<S, R, C> = DepsSelector<S, R> & {
  resultFunc: C;
  recomputations: () => number;
  resetRecomputations: () => number;
};

export type OutputSelector<R, C> = (() => R) & {
  resultFunc: C;
  recomputations: () => number;
  resetRecomputations: () => number;
};

function createDepsSelector(...args: any[]) {
  const selectors: Array<DepsSelector<any, any>> = args.slice(
    0,
    args.length - 1
  );
  const resultFunc: (...args: any[]) => any = args[args.length - 1];
  let recomputations = 0;
  const memoizedFn = memoize((...fnArgs: any[]) => {
    recomputations++;
    return resultFunc(...fnArgs);
  });

  const ret = memoize((state: any) => {
    const params: any[] = [];
    for (const selector of selectors) {
      params.push(selector(state));
    }
    return memoizedFn(...params);
  }) as DepsOutputSelector<any, any, () => any>;

  ret.resultFunc = resultFunc;
  ret.resetRecomputations = () => (recomputations = 0);
  ret.recomputations = () => recomputations;

  return ret;
}

type ExtractState<T> = {
  [x in keyof T]: T[x] extends StateGetter<infer S> ? S : any
};

interface DepsResult<TState> {
  /* START AUTOMATICALLY GENERATED */
  createSelector<R1, R>(
    selector1: (state: TState) => R1,
    resultFunc: (arg1: R1) => R
  ): OutputSelector<R, (arg1: R1) => R>;

  createSelector<R1, R2, R>(
    selector1: (state: TState) => R1,
    selector2: (state: TState) => R2,
    resultFunc: (arg1: R1, arg2: R2) => R
  ): OutputSelector<R, (arg1: R1, arg2: R2) => R>;

  createSelector<R1, R2, R3, R>(
    selector1: (state: TState) => R1,
    selector2: (state: TState) => R2,
    selector3: (state: TState) => R3,
    resultFunc: (arg1: R1, arg2: R2, arg3: R3) => R
  ): OutputSelector<R, (arg1: R1, arg2: R2, arg3: R3) => R>;

  createSelector<R1, R2, R3, R4, R>(
    selector1: (state: TState) => R1,
    selector2: (state: TState) => R2,
    selector3: (state: TState) => R3,
    selector4: (state: TState) => R4,
    resultFunc: (arg1: R1, arg2: R2, arg3: R3, arg4: R4) => R
  ): OutputSelector<R, (arg1: R1, arg2: R2, arg3: R3, arg4: R4) => R>;

  createSelector<R1, R2, R3, R4, R5, R>(
    selector1: (state: TState) => R1,
    selector2: (state: TState) => R2,
    selector3: (state: TState) => R3,
    selector4: (state: TState) => R4,
    selector5: (state: TState) => R5,
    resultFunc: (arg1: R1, arg2: R2, arg3: R3, arg4: R4, arg5: R5) => R
  ): OutputSelector<R, (arg1: R1, arg2: R2, arg3: R3, arg4: R4, arg5: R5) => R>;

  createSelector<R1, R2, R3, R4, R5, R6, R>(
    selector1: (state: TState) => R1,
    selector2: (state: TState) => R2,
    selector3: (state: TState) => R3,
    selector4: (state: TState) => R4,
    selector5: (state: TState) => R5,
    selector6: (state: TState) => R6,
    resultFunc: (
      arg1: R1,
      arg2: R2,
      arg3: R3,
      arg4: R4,
      arg5: R5,
      arg6: R6
    ) => R
  ): OutputSelector<
    R,
    (arg1: R1, arg2: R2, arg3: R3, arg4: R4, arg5: R5, arg6: R6) => R
  >;

  createSelector<R1, R2, R3, R4, R5, R6, R7, R>(
    selector1: (state: TState) => R1,
    selector2: (state: TState) => R2,
    selector3: (state: TState) => R3,
    selector4: (state: TState) => R4,
    selector5: (state: TState) => R5,
    selector6: (state: TState) => R6,
    selector7: (state: TState) => R7,
    resultFunc: (
      arg1: R1,
      arg2: R2,
      arg3: R3,
      arg4: R4,
      arg5: R5,
      arg6: R6,
      arg7: R7
    ) => R
  ): OutputSelector<
    R,
    (arg1: R1, arg2: R2, arg3: R3, arg4: R4, arg5: R5, arg6: R6, arg7: R7) => R
  >;

  createSelector<R1, R2, R3, R4, R5, R6, R7, R8, R>(
    selector1: (state: TState) => R1,
    selector2: (state: TState) => R2,
    selector3: (state: TState) => R3,
    selector4: (state: TState) => R4,
    selector5: (state: TState) => R5,
    selector6: (state: TState) => R6,
    selector7: (state: TState) => R7,
    selector8: (state: TState) => R8,
    resultFunc: (
      arg1: R1,
      arg2: R2,
      arg3: R3,
      arg4: R4,
      arg5: R5,
      arg6: R6,
      arg7: R7,
      arg8: R8
    ) => R
  ): OutputSelector<
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

  createSelector<R1, R2, R3, R4, R5, R6, R7, R8, R9, R>(
    selector1: (state: TState) => R1,
    selector2: (state: TState) => R2,
    selector3: (state: TState) => R3,
    selector4: (state: TState) => R4,
    selector5: (state: TState) => R5,
    selector6: (state: TState) => R6,
    selector7: (state: TState) => R7,
    selector8: (state: TState) => R8,
    selector9: (state: TState) => R9,
    resultFunc: (
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
  ): OutputSelector<
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

  createSelector<R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R>(
    selector1: (state: TState) => R1,
    selector2: (state: TState) => R2,
    selector3: (state: TState) => R3,
    selector4: (state: TState) => R4,
    selector5: (state: TState) => R5,
    selector6: (state: TState) => R6,
    selector7: (state: TState) => R7,
    selector8: (state: TState) => R8,
    selector9: (state: TState) => R9,
    selector10: (state: TState) => R10,
    resultFunc: (
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
  ): OutputSelector<
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

  createSelector<R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R>(
    selector1: (state: TState) => R1,
    selector2: (state: TState) => R2,
    selector3: (state: TState) => R3,
    selector4: (state: TState) => R4,
    selector5: (state: TState) => R5,
    selector6: (state: TState) => R6,
    selector7: (state: TState) => R7,
    selector8: (state: TState) => R8,
    selector9: (state: TState) => R9,
    selector10: (state: TState) => R10,
    selector11: (state: TState) => R11,
    resultFunc: (
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
  ): OutputSelector<
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

  createSelector<R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R>(
    selector1: (state: TState) => R1,
    selector2: (state: TState) => R2,
    selector3: (state: TState) => R3,
    selector4: (state: TState) => R4,
    selector5: (state: TState) => R5,
    selector6: (state: TState) => R6,
    selector7: (state: TState) => R7,
    selector8: (state: TState) => R8,
    selector9: (state: TState) => R9,
    selector10: (state: TState) => R10,
    selector11: (state: TState) => R11,
    selector12: (state: TState) => R12,
    resultFunc: (
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
  ): OutputSelector<
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

  useMappedState<R>(mapper: (state: TState) => R, deps?: any[]): R;
}

interface StateGetterMap {
  [x: string]: StateGetter<any>;
}

class StateProxy {
  private keys: string[];
  private state: any = null;
  private stateArr: any[] = [];

  constructor(private stateGetterMap: StateGetterMap) {
    this.keys = Object.keys(stateGetterMap);
  }

  getState() {
    const newState: any = {};
    const newStateArr: any[] = [];
    for (let i = 0; i < this.keys.length; i++) {
      const key = this.keys[i];
      const localState = this.stateGetterMap[key]();
      newState[key] = localState;
      newStateArr[i] = localState;
    }
    if (!shallowEqual(this.stateArr, newStateArr)) {
      this.state = newState;
      this.stateArr = newStateArr;
    }
    return this.state;
  }
}

export function createDeps<T extends StateGetterMap>(
  stateGetterMap: T
): DepsResult<ExtractState<T>> {
  const stateProxy = new StateProxy(stateGetterMap);
  return {
    createSelector(...args: any[]) {
      const selector = createDepsSelector(...args);

      const wrapperSelector = () => {
        return selector(stateProxy.getState());
      };
      wrapperSelector.resultFunc = selector.resultFunc;
      wrapperSelector.resetRecomputations = selector.resetRecomputations;
      wrapperSelector.recomputations = selector.recomputations;
      return wrapperSelector;
    },
    useMappedState(mapper, deps: any[] = []) {
      const stateGetters = Object.values(stateGetterMap);
      return useMappedState(
        stateGetters as any,
        () => mapper(stateProxy.getState()),
        deps
      );
    },
  };
}
