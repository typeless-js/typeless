import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { CounterActions } from '../interface';

export function Counter() {
  const { increase } = useActions(CounterActions);
  const { count } = useMappedState(state => state.counter);
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
