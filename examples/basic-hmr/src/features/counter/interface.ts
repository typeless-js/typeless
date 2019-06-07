import { createModule } from 'typeless';
import { CounterSymbol } from './symbol';

export const [useModule, CounterActions, getCounterState] = createModule(
  CounterSymbol
)
  .withActions({
    increase: null,
  })
  .withState<CounterState>();

export interface CounterState {
  count: number;
}
