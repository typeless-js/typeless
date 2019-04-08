import { Observable } from 'rxjs';

export interface AC {
  (...args: any[]): any;
  getType?(): ActionType;
}

export type ActionType = [symbol, string];

export type Flatten<T> = { [K in keyof T]: T[K] };

export type ActionLike = { type?: ActionType; payload?: any; meta?: any };
export type Action = { type: ActionType; payload?: any; meta?: any };

export type Reducer<S = any> = (state: S | undefined, action: ActionLike) => S;

export type ExtractPayload<T> = T extends { payload: infer P } ? P : null;

export interface Deps {
  action$: Observable<{ type: ActionType; payload?: any; meta?: any }>;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StateGetter<T> {
  (): T;
  useState(): T;
}
