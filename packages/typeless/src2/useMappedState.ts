import React from 'react';
import { StateGetter } from './types';
import { Store } from './Store';

export function useMappedState<T1, R>(
  stateGetters: [StateGetter<T1>],
  mapper: (state1: T1) => R,
  deps?: any[]
): R;
export function useMappedState<T1, T2, R>(
  stateGetters: [StateGetter<T1>, StateGetter<T2>],
  mapper: (state1: T1, state2: T1) => R,
  deps?: any[]
): R;
export function useMappedState<T1, T2, T3, R>(
  stateGetters: [StateGetter<T1>, StateGetter<T2>, StateGetter<T3>],
  mapper: (state1: T1, state2: T2, state3: T3) => R,
  deps?: any[]
): R;
export function useMappedState<T1, T2, T3, T4, R>(
  stateGetters: [
    StateGetter<T1>,
    StateGetter<T2>,
    StateGetter<T3>,
    StateGetter<T4>
  ],
  mapper: (state1: T1, state2: T2, state3: T3, state4: T4) => R,
  deps?: any[]
): R;
export function useMappedState(
  stateGetters: Array<StateGetter<any>>,
  mapper: (...args: any[]) => any,
  deps: any[] = []
) {
  const mapperCached = React.useCallback(mapper, deps);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  const stores = React.useMemo(
    () => stateGetters.map((getter: any) => getter._store as Store),
    []
  );

  const getMappedState = () => {
    const states = stores.map(store => store.state);
    return mapperCached(...states);
  };

  const getSubscribeFn = () => {
    stateRef.current = getMappedState();
    forceUpdate({});
  };

  const stateRef = React.useRef(getMappedState());
  const subscribeRef = React.useRef(getSubscribeFn);

  React.useEffect(() => {
    const subscriptions = stores.map(store =>
      store.subscribe(() => subscribeRef.current())
    );
    return () => {
      subscriptions.forEach(subscription => subscription());
    };
  }, []);

  React.useMemo(() => {
    stateRef.current = getMappedState();
    subscribeRef.current = getSubscribeFn;
  }, deps);

  return stateRef.current;
}
