import { createModule } from 'typeless';
import { CounterSymbol } from './symbol';

export const [handle, CounterActions, getCounterState] = createModule(
  CounterSymbol
)
  // Create Actions Creators
  // `type` property is generated automatically
  .withActions({
    startCount: null, // null means no args
    countDone: (count: number) => ({ payload: { count } }),
  })
  .withState<CounterState>();

// Redux state for this module
export interface CounterState {
  isLoading: boolean;
  count: number;
}
