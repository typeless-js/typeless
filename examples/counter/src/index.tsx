import React from 'react';
import ReactDOM from 'react-dom';
import * as Rx from 'typeless/rx';
import { createModule, useActions } from 'typeless';

/* == Module Interface == */

export const [useModule, CounterActions, getCounterState] = createModule(
  Symbol('counter')
)
  // Create Actions Creators
  .withActions({
    startCount: null, // null means no args
    countDone: (count: number) => ({ payload: { count } }),
  })
  .withState<CounterState>();

export interface CounterState {
  isLoading: boolean;
  count: number;
}

/* == Module Implementation == */

const initialState: CounterState = {
  isLoading: false,
  count: 0,
};

// Create Epic for side effects
useModule
  .epic()
  // Listen for `count` and dispatch `countDone` with 500ms delay
  .on(CounterActions.startCount, () =>
    Rx.of(CounterActions.countDone(1)).pipe(Rx.delay(500))
  );

// Create a reducer
// Under the hood it uses `immer` and state mutations are allowed
useModule
  .reducer(initialState)
  .on(CounterActions.startCount, state => {
    state.isLoading = true;
  })
  .on(CounterActions.countDone, (state, { count }) => {
    state.isLoading = false;
    state.count += count;
  });

/* == Use Module in React == */

export function Counter() {
  // load epic and reducer
  useModule();

  // wrap actions with `dispatch`
  const { startCount } = useActions(CounterActions);
  // get state from store
  const { isLoading, count } = getCounterState.useState();

  return (
    <div>
      <button disabled={isLoading} onClick={startCount}>
        {isLoading ? 'loading...' : 'increase'}
      </button>
      <div>count: {count}</div>
    </div>
  );
}

ReactDOM.render(<Counter />, document.getElementById('app'));
