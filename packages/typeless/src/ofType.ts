import * as Rx from 'rxjs/operators';
import { Action } from 'redux';
import { OperatorFunction } from 'rxjs';
import { AC } from './types';

export type OfType = {
  <T extends AC>(ac: T): OperatorFunction<Action, ReturnType<T>>;

  <T extends AC, T2 extends AC>(ac: [T, T2]): OperatorFunction<
    Action,
    ReturnType<T> | ReturnType<T2>
  >;

  <T extends AC, T2 extends AC, T3 extends AC>(
    ac: [T, T2, T3]
  ): OperatorFunction<Action, ReturnType<T> | ReturnType<T2> | ReturnType<T3>>;

  <T extends AC, T2 extends AC, T3 extends AC, T4 extends AC>(
    ac: [T, T2, T3, T4]
  ): OperatorFunction<
    Action,
    ReturnType<T> | ReturnType<T2> | ReturnType<T3> | ReturnType<T4>
  >;

  <T extends AC, T2 extends AC, T3 extends AC, T4 extends AC, T5 extends AC>(
    ac: [T, T2, T3, T4, T5]
  ): OperatorFunction<
    Action,
    | ReturnType<T>
    | ReturnType<T2>
    | ReturnType<T3>
    | ReturnType<T4>
    | ReturnType<T5>
  >;

  <
    T extends AC,
    T2 extends AC,
    T3 extends AC,
    T4 extends AC,
    T5 extends AC,
    T6 extends AC
  >(
    ac: [T, T2, T3, T4, T5, T6]
  ): OperatorFunction<
    Action,
    | ReturnType<T>
    | ReturnType<T2>
    | ReturnType<T3>
    | ReturnType<T4>
    | ReturnType<T5>
    | ReturnType<T6>
  >;
};

const getType = (ac: any) => ac.toString();

export const ofType: OfType = (ac: AC | AC[]) => {
  if (Array.isArray(ac)) {
    return Rx.filter((action: any) =>
      ac.some(item => getType(item) === action.type)
    ) as any;
  }
  return Rx.filter((action: any) => action.type === getType(ac)) as any;
};
