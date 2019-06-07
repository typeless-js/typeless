import React from 'react';
import { useActions } from 'typeless';
import { CounterActions, getCounterState } from '../interface';

export function Counter() {
  const { increase } = useActions(CounterActions);
  const { count } = getCounterState.useState();
  return (
    <div>
      <button onClick={increase}>increase</button>
      <div>count: {count}</div>
      <small>
        Edit this text in your IDE. The counter value should remain the same.
      </small>
    </div>
  );
}
