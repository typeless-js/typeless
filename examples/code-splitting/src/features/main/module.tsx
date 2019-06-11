import React from 'react';
import { useModule, MainState, MainActions } from './interface';
import { MainView } from './components/MainView';

const initialState: MainState = {
  viewType: null,
};

useModule
  .reducer(initialState)
  //
  .on(MainActions.show, (state, { viewType }) => {
    state.viewType = viewType;
  });

export default function CatModule() {
  useModule();

  return <MainView />;
}
