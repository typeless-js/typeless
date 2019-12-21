import React from 'react';
import { CounterActions, CounterState, useModule } from './interface';
import { Counter } from './components/Counter';

const initialState: CounterState = {
  count: 0,
};

useModule.reducer(initialState).on(CounterActions.increase, state => {
  state.count++;
});

export default function CounterModule() {
  useModule();

  return <Counter />;
}
