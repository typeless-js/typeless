---
id: custom-store
title: Custom Store
hide_title: true
sidebar_label: Custom Store
---
 
# Custom Store
It's recommended to use [`initialize`](/api/initialize) to create your store.  
If for some reason you need to customize the store you can use low-level API, similar to standard Redux approach.



```tsx
// store.tsx
import { RootEpic, RootReducer, createEpicMiddleware } from 'typeless';
import { createStore, applyMiddleware } from 'redux';

export const rootEpic = new RootEpic();
export const rootReducer = new RootReducer();

const epicMiddleware = createEpicMiddleware(rootEpic);

export const store = createStore(
  rootReducer.getReducer(),
  applyMiddleware(epicMiddleware)
);

// index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { TypelessProvider } from 'typeless';
import { rootEpic, rootReducer, store } store './store';
import App from './components/App';

ReactDOM.render(
  <TypelessProvider rootEpic={rootEpic} rootReducer={rootReducer} store={store}>
    <App />
  </TypelessProvider>,
  document.getElementById('app')
);
```