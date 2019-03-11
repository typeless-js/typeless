---
id: quick-start
title: Quick Start
hide_title: true
sidebar_label: Quick Start
---

# Quick Start
[typeless](https://github.com/typeless-js/typeless) is a toolkit for building React apps using Typescript, Redux, and RxJS.


## Installation

Required peer dependencies: `react@^16.8`, `redux@^4` and `rxjs^@6`

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
import { initialize } from 'typeless';
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
Each feature is split into 3 main parts:
- **interface.ts** - contains action definitions and type information.
- **module.tsx** - contains epic, reducer, any business logic and entry point component.
- **components/** - react components for this module.

### `Interface`
Other modules should communicate only by referring to object/types defined in the interface file.  
This file should be as small as possible. Avoid depending on external libraries.  

```tsx
// features/counter/interface.ts

import { createActions } from 'typeless';

// Module name must be unique
// It's used as a prefix in actions and for logging in epics
export const MODULE = 'counter';

// Create Actions Creators
// `type` property is generated automatically
export const CounterActions = createActions(MODULE, {
  startCount: null, // null means no args
  countDone: (count: number) => ({ payload: { count } }),
});

// Redux state for this module
export interface CounterState {
  isLoading: boolean;
  count: number;
}

// Extend default state
// This is a global redux state
declare module 'typeless/types' {
  interface DefaultState {
    counter: CounterState;
  }
}
```

### `Module`

```js
// features/counter/module.ts

import React from 'react';
import * as Rx from 'typeless/rx';
import { useModule, createEpic, createReducer } from 'typeless';
import { CounterActions, CounterState, MODULE } from './interface';
import { Counter } from './components/Counter';

// Create Epic for side effects
const epic = createEpic(MODULE)
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
const reducer = createReducer(initialState)
  .on(CounterActions.startCount, state => {
    state.isLoading = true;
  })
  .on(CounterActions.countDone, (state, { count }) => {
    state.isLoading = false;
    state.count += count;
  });

// Entry point component for this module
export default function CounterModule() {
  // load epic and reducer to the store
  useModule({
    epic,
    reducer,
    reducerPath: ['counter'],
  });

  return <Counter />;
}
```

### `Component`

```js
// features/counter/components/Counter.tsx

import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { CounterActions } from '../interface';

// Create a stateless component with hooks
// NOTE: there are no type annotations, and the below code is 100% type-safe!
export function Counter() {
  // wrap actions with `dispatch`
  const { startCount } = useActions(CounterActions);
  // get state from redux store
  const { isLoading, count } = useMappedState(state => state.counter);

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