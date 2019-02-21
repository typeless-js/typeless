import { createActions } from 'typeless';

// Module name must be unique
// It's used as a prefix in actions and for logging in epics
export const MODULE = 'counter';

// Create Actions Creators
// `type` property is generated automatically
export const CounterActions = createActions(MODULE, {
  startCount: null, // null means no args
  countDone: (amount: number) => ({ payload: { amount } }),
});

// Redux state for this module
export interface CounterState {
  isLoading: boolean;
  count: number;
}

// Extend default state
// This is a global redux state
declare module 'typeless/types' {
  interface DefaultState {
    counter: CounterState;
  }
}
