import { Observable } from 'rxjs';
import { AnyAction } from 'redux';

export interface AC {
  (...args: any[]): any;
  getSymbol?(): symbol;
}

export type Flatten<T> = { [K in keyof T]: T[K] };

export type ActionLike = { type?: symbol; payload?: any; meta?: any };

// export type ReducerMap<S> = {
//   [action: string]: Array<Reducer<S>>;
// };

export type Reducer<S = any> = (state: S | undefined, action: ActionLike) => S;

export type ExtractPayload<T> = T extends { payload: infer P } ? P : null;

export interface Deps {
  action$: Observable<AnyAction>;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type StateGetter<T> = () => T;
