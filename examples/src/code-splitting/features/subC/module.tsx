import React from 'react';
import { SubCActions, SubCState, useModule } from './interface';
import { SubCView } from './components/SubCView';

const initialState: SubCState = {
  counter: 1,
};

useModule.reducer(initialState).on(SubCActions.double, state => {
  state.counter *= 2;
});

export default function CatModule() {
  useModule();

  return <SubCView />;
}
