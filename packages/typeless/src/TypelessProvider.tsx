import React, { useMemo } from 'react';
import { Store } from 'redux';
import { StoreContext } from 'redux-react-hook';
import { TypelessContext } from './TypelessContext';
import { RootReducer } from './RootReducer';
import { RootEpic } from './RootEpic';

export interface TypelessProviderProps {
  store: Store;
  rootEpic: RootEpic<any>;
  rootReducer: RootReducer<any>;
  children: React.ReactChild;
}

export function TypelessProvider(props: TypelessProviderProps) {
  const { store, rootEpic, rootReducer, children } = props;
  const context = useMemo(
    () => ({
      store,
      rootEpic,
      rootReducer,
    }),
    [store, rootEpic, rootReducer]
  );
  return (
    <StoreContext.Provider value={store}>
      <TypelessContext.Provider value={context}>
        {children}
      </TypelessContext.Provider>
    </StoreContext.Provider>
  );
}
