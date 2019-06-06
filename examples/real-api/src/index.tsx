import React from 'react';
import ReactDOM from 'react-dom';
import { DefaultTypelessProvider } from 'typeless';
import CatModule from './features/cat/module';

ReactDOM.render(
  <DefaultTypelessProvider>
    <CatModule />
  </DefaultTypelessProvider>,
  document.getElementById('app')
);
