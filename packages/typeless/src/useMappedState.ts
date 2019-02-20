import { useMappedState as _useMappedState } from 'redux-react-hook';
import { useCallback } from 'react';
import { DefaultState } from './types';

export function useMappedState<R, T = DefaultState>(
  fn: (state: T) => R,
  deps?: any[]
) {
  const mapState = useCallback(fn, deps || []);
  return _useMappedState(mapState);
}
