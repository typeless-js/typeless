import React from 'react';
import { useModule, createEpic, createReducer } from 'typeless';
import { SubCActions, SubCState, MODULE } from './interface';
import { SubCView } from './components/SubCView';

const epic = createEpic(MODULE);

const initialState: SubCState = {
  counter: 1,
};

const reducer = createReducer(initialState).on(SubCActions.double, state => {
  state.counter *= 2;
});

export default function CatModule() {
  useModule({
    epic,
    reducer,
    reducerPath: ['subC'],
  });

  return <SubCView />;
}
