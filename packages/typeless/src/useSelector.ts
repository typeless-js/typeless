import { Selector } from './createSelector';
import { useMappedState } from './useMappedState';

export function useSelector<R>(selector: Selector<R, any>): R {
  return useMappedState(selector.getStateGetters() as any, selector);
}
