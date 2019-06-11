import React from 'react';
import ReactDOM from 'react-dom';
import { DefaultTypelessProvider } from 'typeless';
import MainModule from './features/main/module';

ReactDOM.render(
  <DefaultTypelessProvider>
    <MainModule />
  </DefaultTypelessProvider>,
  document.getElementById('app')
);
