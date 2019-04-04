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
  const [renderCount, forceUpdate] = React.useReducer(x => x + 1, 0);
  const stores = stateGetters.map((getter: any) => getter._store as Store);
  const getMappedState = () => {
    const states = stores.map(store => store.state);
    return mapper(...states);
  };

  const stateRef = React.useRef(getMappedState());
  const initialRef = React.useRef(true);

  // const [state, setState] = React.useState(getMappedState());

  React.useEffect(() => {
    // console.log('init effect', renderCount);
    if (!initialRef.current) {
      stateRef.current = getMappedState();
      forceUpdate({});
    } else {
      initialRef.current = false;
    }
    // setState(getMappedState());
    // forceUpdate({});
    const subscriptions = stores.map(store =>
      store.subscribe(() => {
        console.log('update from subscribe');
        stateRef.current = getMappedState();
        forceUpdate({});
      })
    );
    return () => {
      subscriptions.forEach(subscription => subscription());
    };
  }, deps);

  // React.useEffect(() => {
  //   console.log('update from deps');
  //   setState(getMappedState());
  // }, deps);

  return stateRef.current;
}
