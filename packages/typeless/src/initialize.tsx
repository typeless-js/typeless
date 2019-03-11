import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { RootEpic } from './RootEpic';
import { RootReducer } from './RootReducer';
import { createEpicMiddleware } from './createEpicMiddleware';
import { TypelessProvider as BaseProvider } from './TypelessProvider';

export function initialize() {
  const rootEpic = new RootEpic();
  const rootReducer = new RootReducer();

  const epicMiddleware = createEpicMiddleware(rootEpic);

  const store = createStore(
    rootReducer.getReducer(),
    applyMiddleware(epicMiddleware)
  );

  function TypelessProvider({ children }: { children: React.ReactChild }) {
    return (
      <BaseProvider store={store} rootEpic={rootEpic} rootReducer={rootReducer}>
        {children}
      </BaseProvider>
    );
  }

  return { store, TypelessProvider };
}
