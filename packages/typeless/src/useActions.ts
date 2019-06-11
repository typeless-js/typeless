import { useMemo } from 'react';
import { useRegistry } from './useRegistry';
import { AC } from './types';

export function useActions<T extends { [x: string]: AC }>(
  actionCreators: T
): T {
  const registry = useRegistry();
  const names = Object.keys(actionCreators);
  return useMemo(
    () =>
      names.reduce(
        (mapped: any, key) => {
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
