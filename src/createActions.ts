import { snakeCase } from './utils';

export type Nullable<T> = T | null;

export type AnyFn = (...args: any[]) => any;

export type ConvertAC<T> = false extends T
  ? () => {}
  : T extends AnyFn
  ? T
  : () => {};

export type ConvertActions<T> = { [P in keyof T]: ConvertAC<T[P]> };

export type ActionMap = { [name: string]: Nullable<(...args: any[]) => {}> };

export function createActions<T extends ActionMap>(
  ns: string,
  actionMap: T
): ConvertActions<T> {
  const Actions = Object.keys(actionMap).reduce(
    (acc, key) => {
      const type = ns + '/' + snakeCase(key).toUpperCase();
      acc[key] = (...args: any[]) => {
        const ac = actionMap[key] || (() => ({}));
        const action = ac(...args) as any;
        action.type = type;
        return action;
      };
      acc[key].toString = () => type;
      return acc;
    },
    {} as { [s: string]: any }
  ) as any;
  return Actions;
}
