import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { CounterActions } from '../interface';

// Create a stateless component with hooks
// NOTE: there are no type annotations, and the below code is 100% type safe!
export function Counter() {
  // wrap actions with `dispatch`
  const { startCount } = useActions(CounterActions);
  // get state from redux store
  const { isLoading, count } = useMappedState(state => state.counter);

  return (
    <div>
      <button disabled={isLoading} onClick={startCount}>
        {isLoading ? 'loading...' : 'increase'}
      </button>
      <div>count: {count}</div>
    </div>
  );
}
