import React from 'react';
import { useModule, createEpic, createReducer } from 'typeless';
import { SubBActions, SubBState, MODULE } from './interface';
import { SubBView } from './components/SubBView';

const epic = createEpic(MODULE);

const initialState: SubBState = {
  counter: 0,
};

const reducer = createReducer(initialState).on(SubBActions.decrease, state => {
  state.counter--;
});

export default function CatModule() {
  useModule({
    epic,
    reducer,
    reducerPath: ['subB'],
  });

  return <SubBView />;
}
