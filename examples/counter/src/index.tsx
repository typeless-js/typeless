import React from 'react';
import ReactDOM from 'react-dom';
import { initialize } from 'typeless';
import CounterModule from './features/counter/module';

const { TypelessProvider } = initialize();

ReactDOM.render(
  <TypelessProvider>
    <CounterModule />
  </TypelessProvider>,
  document.getElementById('app')
);
