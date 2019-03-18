---
id: initialize
title: initialize
hide_title: true
sidebar_label: initialize
---

# initialize()
Initialize the store, and create a default provider.  
Check [Custom Store](/using-typeless/custom-store) for custom implementation.


#### Example

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { initialize } from 'typeless';
import App from './components/App';

const { TypelessProvider } = initialize();

ReactDOM.render(
  <TypelessProvider>
    <App />
  </TypelessProvider>,
  document.getElementById('app')
);

```