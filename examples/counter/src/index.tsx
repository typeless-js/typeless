import React from 'react';
import ReactDOM from 'react-dom';
import { TypelessProvider } from 'typeless';
import { store, rootEpic, rootReducer } from './store';
import CounterModule from './features/counter/module';

ReactDOM.render(
  <TypelessProvider store={store} rootEpic={rootEpic} rootReducer={rootReducer}>
    <CounterModule />
  </TypelessProvider>,
  document.getElementById('app')
);
