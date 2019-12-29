import React from 'react';
import ReactDOM from 'react-dom';
import { DefaultTypelessProvider } from 'typeless';
import { ExampleModule } from './features/example/module';

ReactDOM.render(
  <DefaultTypelessProvider>
    <ExampleModule />
  </DefaultTypelessProvider>,
  document.getElementById('app')
);
