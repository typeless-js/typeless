import React, { useEffect, useContext, useMemo } from 'react';
import { TypelessContext } from './TypelessContext';
import { Epic } from './Epic';
import { getIsHmr } from './onHmr';
import { AC, Reducer } from './types';

interface BaseLoaderOptions<TState> {
  children?: React.ReactChild;
  epic: Epic<TState>;
  actions?: {
    mounted?: AC;
    unmounted?: AC;
    remounted?: AC;
    [x: string]: AC;
  };
}

export interface ModuleLoaderOptions<TState, TPathA extends keyof TState>
  extends BaseLoaderOptions<TState> {
  reducer: Reducer<TState[TPathA]>;
  reducerPath: [TPathA];
}

export interface ModuleLoaderOptions2<
  TState,
  TPathA extends keyof TState,
  TPathB extends keyof TState[TPathA]
> extends BaseLoaderOptions<TState> {
  reducer: Reducer<TState[TPathA][TPathB]>;
  reducerPath: [TPathA, TPathB];
}

export function useModule<
  TState,
  TPathA extends keyof TState,
  TPathB extends keyof TState[TPathA]
>(
  options:
    | ModuleLoaderOptions<TState, TPathA>
    | ModuleLoaderOptions2<TState, TPathA, TPathB>
) {
  const { epic, reducer, reducerPath, actions } = options;
  const { rootEpic, rootReducer, store } = useContext(TypelessContext);

  useMemo(() => {
    rootEpic.addEpic(epic);
    rootReducer.addReducer(reducer, reducerPath as string[]);

    if (getIsHmr()) {
      if (actions && actions.remounted) {
        store.dispatch(actions.remounted());
      }
    } else {
      store.dispatch({ type: '@@typeless/added' });
      if (actions && actions.mounted) {
        store.dispatch(actions.mounted());
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      rootEpic.removeEpic(epic.epicName);
      rootReducer.removeReducer(reducerPath as string[]);
      if (actions && actions.unmounted) {
        store.dispatch(actions.unmounted());
      }
    };
  }, []);
}
