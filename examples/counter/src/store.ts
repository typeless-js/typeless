import { applyMiddleware, createStore } from 'redux';
import { createEpicMiddleware, RootEpic, RootReducer } from 'typeless';

export const rootEpic = new RootEpic();
export const rootReducer = new RootReducer();

const epicMiddleware = createEpicMiddleware(rootEpic);

export const store = createStore(
  rootReducer.getReducer(),
  applyMiddleware(epicMiddleware)
);
