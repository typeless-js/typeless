import { createActions } from 'typeless';

export const MODULE = 'counter';

export const CounterActions = createActions(MODULE, {
  increase: null,
});

export interface CounterState {
  count: number;
}

declare module 'typeless/types' {
  interface DefaultState {
    counter: CounterState;
  }
}
