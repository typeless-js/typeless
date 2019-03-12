import React from 'react';
import ReactDOM from 'react-dom';
import { initialize } from 'typeless';
import CatModule from './features/cat/module';

const { TypelessProvider } = initialize();

ReactDOM.render(
  <TypelessProvider>
    <CatModule />
  </TypelessProvider>,
  document.getElementById('app')
);
