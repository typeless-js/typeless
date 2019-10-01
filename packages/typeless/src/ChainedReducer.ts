import { produce } from 'immer';
import {
  AC,
  Flatten,
  ExtractPayload,
  Reducer,
  ActionLike,
  ActionType,
} from './types';
import { toArray, getACType } from './utils';

export type OnHandler<S, T extends AC> = (
  state: S,
  payload: ExtractPayload<ReturnType<T>>,
  action: Flatten<ReturnType<T> & { type: string }>
) => void;

export type ReplaceHandler<S, T extends AC> = (
  state: S,
  payload: ExtractPayload<ReturnType<T>>,
  action: Flatten<ReturnType<T> & { type: string }>
) => S;

export type AttachFn<S> = {
  <T extends keyof S>(prop: T, fn: Reducer<S[T]>): ChainedReducer<S>;
  (fn: Reducer<S>): ChainedReducer<S>;
};

const createNestedReducer = <S, P extends keyof S>(
  prop: P,
  reducer: Reducer<S[P]>
): Reducer<S> => (state, action) => {
  if (typeof state === 'undefined') {
    throw new Error(
      'tried to create createNestedReducer with undefined parent state'
    );
  }
  const subState = reducer(state[prop], action);
  if (state[prop] !== subState) {
    return {
      ...state,
      [prop]: subState,
    };
  }
  return state;
};

export class ChainedReducer<S> {
  private reducerMap: Map<symbol, Map<string, Array<Reducer<S>>>>;
  private defaultReducers: Array<Reducer<S>>;
  private reducer: ChainedReducer<S> & Reducer<S> | null;

  constructor(private initial: S) {
    this.reducerMap = new Map();
    this.defaultReducers = [];
    this.reducer = null;
  }

  asReducer() {
    if (!this.reducer) {
      const reducer: any = this.getReducer();
      Object.getOwnPropertyNames(ChainedReducer.prototype).forEach(key => {
        const prop = (this as any)[key];
        if (typeof prop === 'function') {
          reducer[key] = prop.bind(this);
        }
      });
      this.reducer = reducer;
    }
    return this.reducer!;
  }

  attach<T extends keyof S>(fn: Reducer<S>): ChainedReducer<S> & Reducer<S>;
  attach<T extends keyof S>(
    prop: T,
    fn: Reducer<S[T]>
  ): ChainedReducer<S> & Reducer<S>;
  attach<T extends keyof S>(prop: T | Reducer<S>, fn?: Reducer<S[T]>) {
    if (typeof prop === 'string') {
      if (typeof fn !== 'function') {
        throw new Error('fn must be a function');
      }
      this.defaultReducers.push(createNestedReducer(prop, fn));
    } else {
      if (typeof prop !== 'function') {
        throw new Error('fn must be a function');
      }
      this.defaultReducers.push(prop);
    }
    return this.asReducer();
  }

  replace<T extends AC>(actionCreator: T, fn: ReplaceHandler<S, T>) {
    this.transform(
      actionCreator,
      (state, action: any) =>
        produce(state, draft => fn(draft as S, action.payload, action))! as S
    );
    return this.asReducer();
  }

  mergePayload(actionCreators: AC) {
    this.transform(actionCreators, (state, action: any) =>
      Object.assign({}, state, action.payload)
    );
    return this.asReducer();
  }

  nested<T extends keyof S>(
    prop: T,
    fn: (reducer: ChainedReducer<S[T]>) => ChainedReducer<S[T]>
  ) {
    const nested = fn(new ChainedReducer(this.initial[prop]));
    this.defaultReducers.push(createNestedReducer(prop, nested.getReducer()));
    return this.asReducer();
  }

  on<T extends AC>(actionCreator: T, fn: OnHandler<S, T>) {
    this.transform(
      actionCreator,
      (state, action: any) =>
        produce(state, draft => fn(draft as S, action.payload, action))!
    );
    return this.asReducer();
  }

  onMany<T extends AC, T2 extends AC>(
    actionCreator: [T, T2],
    fn: OnHandler<S, T | T2>
  ): Reducer<S> & this;
  onMany<T extends AC, T2 extends AC, T3 extends AC>(
    actionCreator: [T, T2, T3],
    fn: OnHandler<S, T | T2 | T3>
  ): Reducer<S> & this;
  onMany(actionCreator: any, fn: OnHandler<S, AC>) {
    return this.on(actionCreator, fn);
  }

  private getReducer() {
    return (state: S = this.initial, action: ActionLike) => {
      if (!action.type) {
        throw new Error('action.type must be defined');
      }
      const reducers = this.getReducers(action.type).concat(
        this.defaultReducers
      );
      if (!reducers.length) {
        return state;
      }
      return reducers.reduce((prev, fn) => fn(prev, action), state);
    };
  }

  private getReducers(actionType: ActionType) {
    const [symbol, type] = actionType!;
    if (!this.reducerMap.has(symbol)) {
      this.reducerMap.set(symbol, new Map());
    }
    const map = this.reducerMap.get(symbol)!;
    if (!map.has(type)) {
      map.set(type, []);
    }
    return map.get(type)!;
  }

  private transform(actionCreators: AC | AC[], reducerFn: Reducer<S>) {
    const actionTypes = toArray(actionCreators).map(ac => getACType(ac));
    actionTypes.forEach(action => {
      this.getReducers(action).push(reducerFn);
    });
  }
}
