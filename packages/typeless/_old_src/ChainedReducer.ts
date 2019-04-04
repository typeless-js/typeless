import { produce } from 'immer';
import {
  AC,
  Flatten,
  ExtractPayload,
  Reducer,
  ReducerMap,
  ActionLike,
} from './types';
import { toArray } from './utils';

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
  private reducerMap: ReducerMap<S>;
  private defaultReducers: Array<Reducer<S>>;
  private reducer: ChainedReducer<S> & Reducer<S>;

  constructor(private initial: S) {
    this.reducerMap = {};
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
    return this.reducer;
  }

  attach<T extends keyof S>(prop: T | Reducer<S>, fn?: Reducer<S[T]>) {
    if (typeof prop === 'function') {
      this.defaultReducers.push(prop);
    } else {
      this.defaultReducers.push(createNestedReducer(prop, fn));
    }
    return this.asReducer();
  }

  replace<T extends AC>(actionCreator: T, fn: ReplaceHandler<S, T>) {
    this.transform(actionCreator, (state, action: any) =>
      produce(state, draft => fn(draft as S, action.payload, action))
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
    this.transform(actionCreator, (state, action: any) =>
      produce(state, draft => fn(draft as S, action.payload, action))
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
      const reducers = (this.reducerMap[action.type] || []).concat(
        this.defaultReducers
      );
      if (!reducers.length) {
        return state;
      }
      return reducers.reduce((prev, fn) => fn(prev, action), state);
    };
  }

  private transform(
    actionCreators: AC | AC[],
    reducerFn: (state: S, action: ActionLike) => S
  ) {
    const actionTypes = toArray(actionCreators).map(ac => ac.toString());
    actionTypes.forEach(action => {
      if (!this.reducerMap[action]) {
        this.reducerMap[action] = [];
      }
      this.reducerMap[action].push(reducerFn);
    });
  }
}
