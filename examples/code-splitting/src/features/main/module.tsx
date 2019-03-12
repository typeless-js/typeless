import React from 'react';
import { useModule, createEpic, createReducer } from 'typeless';
import { MainState, MainActions, MODULE } from './interface';
import { MainView } from './components/MainView';

const epic = createEpic(MODULE);

const initialState: MainState = {
  viewType: null,
};

const reducer = createReducer(initialState).on(
  MainActions.show,
  (state, { viewType }) => {
    state.viewType = viewType;
  }
);

export default function CatModule() {
  useModule({
    epic,
    reducer,
    reducerPath: ['main'],
  });

  return <MainView />;
}
