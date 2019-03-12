import React from 'react';
import { useModule, createEpic, createReducer } from 'typeless';
import { SubAActions, SubAState, MODULE } from './interface';
import { SubAView } from './components/SubAView';

const epic = createEpic(MODULE);

const initialState: SubAState = {
  counter: 0,
};

const reducer = createReducer(initialState).on(SubAActions.increase, state => {
  state.counter++;
});

export default function CatModule() {
  useModule({
    epic,
    reducer,
    reducerPath: ['subA'],
  });

  return <SubAView />;
}
