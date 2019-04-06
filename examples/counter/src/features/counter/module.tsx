import React from 'react';
import * as Rx from 'typeless/rx';
import { CounterActions, CounterState, handle } from './interface';
import { Counter } from './components/Counter';

const initialState: CounterState = {
  isLoading: false,
  count: 0,
};

export const useModule = handle
  // Create Epic for side effects
  .addEpic(epic =>
    epic
      // Listen for `count` and dispatch `countDone` with 500ms delay
      .on(CounterActions.startCount, () =>
        Rx.of(CounterActions.countDone(1)).pipe(Rx.delay(500))
      )
  )
  // Create a reducer
  // Under the hood it uses `immer` and state mutations are allowed
  .addReducer(initialState, reducer =>
    reducer
      .on(CounterActions.startCount, state => {
        state.isLoading = true;
      })
      .on(CounterActions.countDone, (state, { count }) => {
        state.isLoading = false;
        state.count += count;
      })
  );

// Entry point component for this module
export default function CounterModule() {
  // load epic and reducer to the store
  useModule();
  return <Counter />;
}
