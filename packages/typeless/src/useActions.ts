import { useMemo } from 'react';
import { AC } from './types';
import { registry } from './Registry';

export function useActions<T extends { [x: string]: AC }>(
  actionCreators: T
): T {
  const names = Object.keys(actionCreators);
  return useMemo(
    () =>
      names.reduce(
        (mapped, key) => {
          mapped[key] = (...args: any[]) => {
            const action = actionCreators[key](...args);
            registry.dispatch(action);
            return action;
          };
          return mapped;
        },
        {} as T
      ),
    names
  );
}
