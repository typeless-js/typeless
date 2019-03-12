import React from 'react';
import { useModule, createEpic, createReducer } from 'typeless';
import { SubBActions, SubBState, MODULE } from './interface';
import { SubBView } from './components/SubBView';

const epic = createEpic(MODULE);

const initialState: SubBState = {
  counter: 0,
};

const reducer = createReducer(initialState)
  .on(SubBActions.decrease, state => {
    state.counter--;
  })
  .on(SubBActions.$unmounting, state => {
    state.counter = 0;
  });

export default function CatModule() {
  useModule({
    epic,
    reducer,
    reducerPath: ['subB'],
    actions: SubBActions,
  });

  return <SubBView />;
}
