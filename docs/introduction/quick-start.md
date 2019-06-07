---
id: quick-start
title: Quick Start
hide_title: true
sidebar_label: Quick Start
---

# Quick Start
[typeless](https://github.com/typeless-js/typeless) is a toolkit for building React apps using Typescript, and RxJS.


## Installation

Required peer dependencies: `react@^16.8`, `react-dom@^16.8` and `rxjs^@6`

```bash
npm install typeless
```

or

```bash
yarn add typeless
```

👉 [Check here full code of the below example.](https://codesandbox.io/s/x3qwol55xq)


## `Setup`
Wrap your application with a provider.

```tsx
// ./index.tsx

import React from 'react';
import ReactDOM from 'react-dom';
import { DefaultTypelessProvider } from 'typeless';
import CounterModule from './features/counter/module';

const { TypelessProvider } = initialize();

ReactDOM.render(
  <TypelessProvider>
    <CounterModule />
  </TypelessProvider>,
  document.getElementById('app')
);
```

## `Feature`
Each feature is split into 4 main parts:
- **symbol.ts** - contains symbol definitions. Symbols must be declared in a separate file to work properly with HMR.
- **interface.ts** - contains action definitions and type information.
- **module.tsx** - contains epic, reducer, any business logic, and entry point component.
- **components/** - react components for this module.

### `Interface`
Other modules should communicate only by referring to object/types defined in the interface file.  
This file should be as small as possible. Avoid depending on external libraries.  

```tsx
// features/counter/symbol.ts

export const CounterSymbol = Symbol('counter');
```

```tsx
// features/counter/interface.ts

import { createActions } from 'typeless';
import { CounterSymbol } from './symbol';

// initialize the module
export const [useModule, CounterActions, getCounterState] = createModule(CounterSymbol)
  // Create Actions Creators
  .withActions({
    startCount: null, // null means no args
    countDone: (count: number) => ({ payload: { count } }),
  })
  //
  .withState<CounterState>();

export interface CounterState {
  isLoading: boolean;
  count: number;
}
```

### `Module`

```js
// features/counter/module.ts

import React from 'react';
import * as Rx from 'typeless/rx';
import { CounterActions, CounterState } from './interface';
import { Counter } from './components/Counter';

// Create Epic for side effects
useModule
  .epic()
  // Listen for `count` and dispatch `countDone` with 500ms delay
  .on(CounterActions.startCount, () =>
    Rx.of(CounterActions.countDone(1)).pipe(Rx.delay(500))
  );

const initialState: CounterState = {
  isLoading: false,
  count: 0,
};

// Create a reducer
// It's compatible with a standard reducer `(state, action) => state`
// Under the hood it uses `immer` and state mutations are allowed
useModule
  .reducer(initialState)
  .on(CounterActions.startCount, state => {
    state.isLoading = true;
  })
  .on(CounterActions.countDone, (state, { count }) => {
    state.isLoading = false;
    state.count += count;
  });

// Entry point component for this module
export default function CounterModule() {
  // load epic and reducer
  useModule();

  return <Counter />;
}
```

### `Component`

```js
// features/counter/components/Counter.tsx

import React from 'react';
import { useActions } from 'typeless';
import { CounterActions } from '../interface';

// Create a stateless component with hooks
// NOTE: there are no type annotations, and the below code is 100% type-safe!
export function Counter() {
  // wrap actions with `dispatch`
  const { startCount } = useActions(CounterActions);
  // get state from store
  const { isLoading, count } = getCounterState.useState();

  return (
    <div>
      <button disabled={isLoading} onClick={startCount}>
        {isLoading ? 'loading...' : 'increase'}
      </button>
      <div>count: {count}</div>
    </div>
  );
}
```