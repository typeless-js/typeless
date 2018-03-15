import { createContext } from 'react';
import { RootReducer } from './RootReducer';
import { Store } from 'redux';
import { RootEpic } from './RootEpic';

export const TypelessContext = createContext({
  rootEpic: null as RootEpic<any>,
  rootReducer: null as RootReducer<any>,
  store: null as Store<any>,
});
