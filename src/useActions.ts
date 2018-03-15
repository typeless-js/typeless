import {
  useDispatch,
  useMappedState as _useMappedState,
} from 'redux-react-hook';
import { useMemo } from 'react';
import { AC } from './types';

export function useActions<T extends { [x: string]: AC }>(
  actionCreators: T
): T {
  const dispatch = useDispatch();
  const names = Object.keys(actionCreators);
  return useMemo(
    () =>
      names.reduce(
        (mapped, key) => {
          mapped[key] = (...args: any[]) => {
            const action = actionCreators[key](...args);
            dispatch(action);
            return action;
          };
          return mapped;
        },
        {} as T
      ),
    names
  );
}
