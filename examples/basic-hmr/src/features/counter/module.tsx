import React from 'react';
import { useModule, createEpic, createReducer } from 'typeless';
import { CounterActions, CounterState, MODULE } from './interface';
import { Counter } from './components/Counter';

const epic = createEpic(MODULE);

const initialState: CounterState = {
  count: 0,
};

const reducer = createReducer(initialState).on(
  CounterActions.increase,
  state => {
    state.count++;
  }
);

export default function CounterModule() {
  useModule({
    epic,
    reducer,
    reducerPath: ['counter'],
  });

  return <Counter />;
}
