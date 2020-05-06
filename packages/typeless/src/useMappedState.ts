import * as React from 'react';
import { StateGetter } from './types';
import { Store } from './Store';
import { objectIs } from './utils';

type TupleOfStateGetter = [] | [StateGetter<any>, ...StateGetter<any>[]];
type ExtractState<T> = T extends StateGetter<any>[]
  ? { [P in keyof T]: T[P] extends StateGetter<infer S> ? S : never }
  : never;

type EqualityFn<T> = (a: T, b: T) => boolean;
const defaultEquality = objectIs;

export function useMappedState<T extends TupleOfStateGetter, R>(
  stateGetters: T,
  mapperFn: (...args: ExtractState<T>) => R,
  deps?: any[]
): R;
export function useMappedState<T extends TupleOfStateGetter, R>(
  stateGetters: T,
  mapperFn: (...args: ExtractState<T>) => R,
  equalityFn: EqualityFn<R>,
  deps?: any[]
): R;

export function useMappedState(
  stateGetters: StateGetter<any>[],
  mapperFn: (...args: any[]) => any,
  equalityFnOrDeps?: EqualityFn<any> | unknown[],
  mayBeDeps: unknown[] = []
) {
  const parseArgs = (): [unknown[], EqualityFn<any>] => {
    if (equalityFnOrDeps === undefined) {
      return [[], defaultEquality];
    }
    if (Array.isArray(equalityFnOrDeps)) {
      return [equalityFnOrDeps, defaultEquality];
    }

    return [mayBeDeps, equalityFnOrDeps];
  };

  const [deps, equalityFn] = parseArgs();
  const mapperCached = React.useCallback(mapperFn, deps);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  const stores = React.useMemo(
    () =>
      stateGetters.map((getter: any) => {
        if (!getter._store) {
          throw new Error(
            `_store not found in getter for module "${getter._module ||
              'unknown'}". Make sure to load the module before using 'useState' or 'useMappedState'.`
          );
        }
        return getter._store as Store;
      }),
    []
  );

  const getMappedState = () => {
    const states = stores.map(store => store.state);
    return mapperCached(...states);
  };

  const getSubscribeFn = () => {
    const newState = getMappedState();
    if (!equalityFn(newState, stateRef.current)) {
      stateRef.current = newState;
      forceUpdate({});
    }
  };

  const stateRef = React.useRef(getMappedState());
  const subscribeRef = React.useRef(getSubscribeFn);

  // subscribe to stored immediately
  // React.useEffect can sometimes miss updates
  React.useLayoutEffect(() => {
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
