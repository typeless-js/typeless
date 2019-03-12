import React from 'react';
import ReactDOM from 'react-dom';
import { initialize } from 'typeless';
import MainModule from './features/main/module';

const { TypelessProvider } = initialize();

ReactDOM.render(
  <TypelessProvider>
    <MainModule />
  </TypelessProvider>,
  document.getElementById('app')
);
