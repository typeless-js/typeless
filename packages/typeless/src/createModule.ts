import { ChainedReducer } from './ChainedReducer';
import { Epic } from './Epic';
import * as React from 'react';
import { getIsHmr } from './onHmr';
import { StateGetter, Reducer } from './types';
import { useMappedState } from './useMappedState';
import { snakeCase } from './utils';
import { useRegistry } from './useRegistry';
import { Store } from './Store';

export type Nullable<T> = T | null;

export type AnyFn = (...args: any[]) => any;

export type ConvertAC<T> = T extends null
  ? () => {}
  : T extends AnyFn
  ? T
  : never;
export type ActionCreators<T> = { [P in keyof T]: ConvertAC<T[P]> };

export type ActionMap = { [name: string]: Nullable<(...args: any[]) => {}> };

export interface HandleWithState<TState> {
  (): void;
  epic(): Epic;
  reducer(initialState: TState): ChainedReducer<TState>;
  reset(): void;
}

export interface Handle {
  (): void;
  epic(): Epic;
}

type ModuleBase = [Handle] & {
  withActions<T extends ActionMap>(
    actionMap: T
  ): ModuleWithActions<ActionCreators<T>>;
  withState<TState>(): ModuleWithState<TState>;
};

type ModuleWithActions<TActions> = [Handle, TActions] & {
  withState<TState>(): ModuleWithActionsAndState<TState, TActions>;
};

type ModuleWithState<TState> = [
  HandleWithState<TState>,
  StateGetter<TState>
] & {
  withActions<T extends ActionMap>(
    actionMap: T
  ): ModuleWithActionsAndState<TState, ActionCreators<T>>;
};

type ModuleWithActionsAndState<TState, TActions> = [
  HandleWithState<TState>,
  TActions,
  StateGetter<TState>
];

export function createModule(name: symbol) {
  let hasState = false;
  let actions: ActionMap | null = null;
  let epic: Epic | null = null;
  let reducer: (Reducer<any> & ChainedReducer<any>) | null = null;
  let store: Store | null = null;

  const base = [createHandle()] as any;
  base.withActions = withActions;
  base.withState = withState;

  getState._module = name.toString();
  getState._store = null as Store<any> | null;
  getState.useState = () => useMappedState([getState as any], state => state);

  return base as ModuleBase;

  function createHandle() {
    const handle: HandleWithState<any> = () => {
      const registry = useRegistry();
      store = registry.getStore(name);
      getState._store = store;

      React.useMemo(() => {
        store!.enable({
          epic,
          reducer,
        });
        if (!getIsHmr()) {
          store!.initState();
          if (actions && actions.$init) {
            registry.dispatch(actions.$init());
          }
        }
      }, []);

      // cannot use React.useLayoutEffect here
      // if a $mounted action modifies a store, it won't cause re-render
      React.useEffect(() => {
        if (getIsHmr()) {
          if (actions && actions.$remounted) {
            registry.dispatch(actions.$remounted());
          }
        } else {
          if (actions && actions.$mounted) {
            registry.dispatch(actions.$mounted());
          }
        }
        return () => {
          if (actions && actions.$unmounting) {
            registry.dispatch(actions.$unmounting());
          }
          if (store) {
            store.disable();
          }
          if (actions && actions.$unmounted) {
            registry.dispatch(actions.$unmounted());
          }
        };
      }, []);
    };
    handle.epic = () => {
      epic = new Epic();
      return epic;
    };
    handle.reducer = initialState => {
      const chained = new ChainedReducer(initialState);
      reducer = chained.asReducer();
      return reducer;
    };
    handle.reset = () => {
      epic = null;
      reducer = null;
      store = null;
    };
    return handle;
  }

  function createActions(actionMap: any) {
    actions = Object.keys(actionMap).reduce(
      (acc, key) => {
        const type = snakeCase(key).toUpperCase();
        acc[key] = (...args: any[]) => {
          const ac = actionMap[key] || (() => ({}));
          const action = ac(...args) as any;
          action.type = [name, type];
          return action;
        };
        acc[key].getType = () => [name, type];
        return acc;
      },
      {} as { [s: string]: any }
    ) as any;
  }

  function withActions(newActionMap: object) {
    createActions(newActionMap);
    const ret = [createHandle(), actions] as any;
    if (!hasState) {
      ret.withState = withState;
    } else {
      ret.push(getState);
    }
    return ret;
  }

  function withState() {
    hasState = true;
    const ret = [createHandle()] as any;
    if (!actions) {
      ret.withActions = withActions;
    } else {
      ret.push(actions);
    }
    ret.push(getState);
    return ret;
  }

  function getState() {
    return store ? store.state : undefined;
  }
}
