import React from 'react';
import * as Rx from 'typeless/rx';
import { useModule, createEpic, createReducer } from 'typeless';
import { CatActions, CatState, MODULE } from './interface';
import { CatView } from './components/CatView';

function fetchCatData() {
  return Rx.of({
    imageUrl: `https://cataas.com/cat/gif?_t=${Date.now()}`,
  }).pipe(
    Rx.delay(2000),
    Rx.map(cat => {
      if (Date.now() % 2 === 0) {
        throw new Error('Failed to load cat');
      }
      return cat;
    })
  );
}

const epic = createEpic(MODULE).on(CatActions.loadCat, (_, { action$ }) =>
  fetchCatData().pipe(
    Rx.map(cat => CatActions.catLoaded(cat)),
    Rx.catchError(err => {
      console.error(err);
      return Rx.of(CatActions.errorOcurred(err.message));
    }),
    Rx.takeUntil(action$.pipe(Rx.waitForType(CatActions.cancel)))
  )
);

const initialState: CatState = {
  viewType: 'details',
  cat: null,
  error: '',
};

const reducer = createReducer(initialState)
  .on(CatActions.loadCat, state => {
    state.viewType = 'loading';
  })
  .on(CatActions.errorOcurred, (state, { error }) => {
    state.cat = null;
    state.viewType = 'error';
    state.error = error;
  })
  .on(CatActions.catLoaded, (state, { cat }) => {
    state.viewType = 'details';
    state.cat = cat;
  })
  .on(CatActions.cancel, state => {
    state.viewType = 'details';
  });

export default function CatModule() {
  useModule({
    epic,
    reducer,
    reducerPath: ['cat'],
  });

  return <CatView />;
}
