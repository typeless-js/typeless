---
id: hmr
title: HMR
hide_title: true
sidebar_label: HMR
---
 
# HMR
To enable Hot Module Replacement, you must wrap your main render method with `onHmr`.  
There is no need for methods like `replaceReducer` or `replaceEpic`. Everything is updated automatically!  
Check [Basic HMR](/introduction/examples#basic-hmr) for full working example.

#### Example
```tsx
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { initialize, onHmr } from 'typeless';

const { TypelessProvider } = initialize();

const MOUNT_NODE = document.getElementById('app');

const render = () => {
  const App = require('./components/App').App;
  ReactDOM.unmountComponentAtNode(MOUNT_NODE);
  ReactDOM.render(
    <TypelessProvider>
      <App />
    </TypelessProvider>,
    MOUNT_NODE
  );
};

if (module.hot) {
  module.hot.accept('./components/App', () => {
    // 👇👇👇
    onHmr(render);
  });
}
render();
```