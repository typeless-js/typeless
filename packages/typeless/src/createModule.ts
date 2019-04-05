import { ChainedReducer } from './ChainedReducer';
import { Epic } from './Epic';
// import { Omit } from './types';
// import { getDisplayName } from './Registry';
import React from 'react';
import { getIsHmr } from './onHmr';
import { registry } from './Registry';
import { StateGetter } from './types';

export type Nullable<T> = T | null;

export type AnyFn = (...args: any[]) => any;

export type ConvertAC<T> = false extends T
  ? () => {}
  : T extends AnyFn
  ? T
  : () => {};

export type ConvertActions<T> = { [P in keyof T]: ConvertAC<T[P]> };

export type ActionMap = { [name: string]: Nullable<(...args: any[]) => {}> };

interface HandleWithState<TState> {
  (): void;
  addEpic(fn: (epic: Epic) => void): this;
  addReducer(
    initialState: TState,
    fn: (reducer: ChainedReducer<TState>) => void
  ): this;
}

interface Handle {
  (): void;
  addEpic(fn: (epic: Epic) => void): this;
}

type ModuleBase = [Handle] & {
  withActions<T extends ActionMap>(
    actionMap: T
  ): ModuleWithActions<ConvertActions<T>>;
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
  ): ModuleWithActionsAndState<TState, ConvertActions<T>>;
};

type ModuleWithActionsAndState<TState, TActions> = [
  HandleWithState<TState>,
  TActions,
  StateGetter<TState>
];

export function createModule(name: symbol) {
  // const { registry } = React.useContext(TypelessContext);
  const store = registry.getStore(name);
  let hasState = false;
  let actions: any = null;
  let epic: any = null;
  let reducer: any = null;

  const base = [createHandle()] as any;
  base.withActions = withActions;
  base.withState = withState;

  getState._store = store;

  return base as ModuleBase;

  function createHandle() {
    const handle: HandleWithState<any> = () => {
      React.useMemo(() => {
        store.enable({
          epic,
          reducer,
        });

        if (getIsHmr()) {
          if (actions && actions.$remounted) {
            registry.dispatch(actions.$remounted());
          }
        } else {
          store.initState();
          if (actions && actions.$mounted) {
            registry.dispatch(actions.$mounted());
          }
        }
      }, []);

      React.useEffect(() => {
        return () => {
          if (actions && actions.$unmounting) {
            registry.dispatch(actions.$unmounting());
          }
          store.disable();
          if (actions && actions.$unmounted) {
            registry.dispatch(actions.$unmounted());
          }
        };
      }, []);
    };
    handle.addEpic = fn => {
      epic = new Epic('x');
      fn(epic);
      return handle;
    };
    handle.addReducer = (initialState, fn) => {
      const chained = new ChainedReducer(initialState);
      fn(chained);
      reducer = chained.asReducer();
      return handle;
    };
    return handle;
  }

  function createActions(actionMap: any) {
    actions = Object.keys(actionMap).reduce(
      (acc, key) => {
        const type = registry.getActionSymbol(name, key);
        acc[key] = (...args: any[]) => {
          const ac = actionMap[key] || (() => ({}));
          const action = ac(...args) as any;
          action.type = type;
          return action;
        };
        acc[key].getSymbol = () => type;
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
    return store.state;
  }
}

// const [h1, b, c] = createModule(Symbol('a'));
// const arr = createModule(Symbol('a'));
// const y = [10, 20] as const;
// // const [a1, a2, a3] = y;
// const x = 10 as const; // Type 10

const [myHandle, MyActions, getMyState] = createModule(Symbol('my-module'))
  .withActions({
    foo: null,
    bar: null,
  })
  .withState<{ a: number }>();

const useModule = myHandle
  .addReducer({ a: 1 }, reducer => {
    reducer.on(MyActions.foo, state => {
      state.a++;
    });
  })
  .addEpic(epic =>
    epic.on(MyActions.foo, () => {
      return MyActions.bar();
    })
  );

// useModule();

MyActions.foo();
