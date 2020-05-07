import { Selector } from './createSelector';
import { EqualityFn } from './types';
import { useMappedState } from './useMappedState';

export function useSelector<R>(
  selector: Selector<R, any>,
  equalityFn?: EqualityFn<R>
): R {
  if (equalityFn === undefined) {
    return useMappedState(selector.getStateGetters(), selector);
  } else {
    return useMappedState(selector.getStateGetters(), selector, equalityFn);
  }
}
