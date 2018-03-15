# typeless

Typescript + React Hooks + Redux + RxJS = 😻


[![Build Status](https://travis-ci.org/typeless-js/typeless.svg?branch=master)](https://travis-ci.org/BetterCallSky/typeless) [![npm module](https://badge.fury.io/js/typeless.svg)](https://www.npmjs.org/package/typeless)

## Installation
Required peer dependencies: `react@^16.8` and `rxjs^@6`

```bash
npm i typeless
yarn add typeless
```

## Why Typeless?
Creating scalable React apps with Typescript can be painful. There are many small libraries that can be combined, but none of them provide a complete solution for building complex applications.  
`typeless` provide all building blocks: actions creators, reducers, epics with a minimal overhead of type annotation.  


## Features
- Designed for Typescript and type safety. Only minimal type annotations are required, all types are inferred where possible.
- Simple and developer friendly syntax with React hooks.
- Event-driven architecture using RxJS.
- Reducers and epics are loaded dynamically in React components. There is no single `reducers.ts` or `epics.ts` file.
- Code splitting for reducers and epics work out of the box.
- HMR works out of the box.


## A Basic Example

### Wrap your app with provider

```tsx
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import {
  createEpicMiddleware,
  RootEpic,
  RootReducer,
  TypelessProvider,
} from 'typeless';

const rootEpic = new RootEpic();
const rootReducer = new RootReducer();

const epicMiddleware = createEpicMiddleware(rootEpic);

const store = createStore(
  rootReducer.getReducer(),
  applyMiddleware(epicMiddleware)
);

ReactDOM.render(
  <TypelessProvider
    store={store}
    rootEpic={rootEpic}
    rootReducer={rootReducer}
  >
    <App />
  </TypelessProvider>,
  document.getElementById('app')
);
```


### Create component and module

```tsx
// App.tsx
import React from 'react';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  createActions,
  useModule,
  createEpic,
  createReducer,
  useActions,
  useMappedState,
} from 'typeless';

// Module name must be unique
// It's used as a prefix in actions and for logging in epics
const MODULE = 'sample';

// Create Actions Creators
// `type` property is generated automatically
const MyActions = createActions(MODULE, {
  ping: null, // null means no args
  pong: (date: Date) => ({ payload: { date } }),
});

// Create Epic for side effects
const epic = createEpic(MODULE)
  // Listen for `ping` and dispatch `pong` with 500ms delay
  .on(MyActions.ping, () => of(MyActions.pong(new Date())).pipe(delay(500)));

// Redux state for this module
interface SampleState {
  isPinging: boolean;
  lastPongAt: Date;
}

// Extend default state
// This is a global redux state
declare module 'typeless/types' {
  interface DefaultState {
    sample: SampleState;
  }
}

const initialState: SampleState = {
  isPinging: false,
  lastPongAt: null,
};

// Create a reducer
// It's compatible with a standard reducer `(state, action) => state`
// Under the hood it uses `immer` and state mutations are allowed
const reducer = createReducer(initialState)
  .on(MyActions.ping, state => {
    state.isPinging = true;
  })
  .on(MyActions.pong, (state, { date }) => {
    state.isPinging = false;
    state.lastPongAt = date;
  });

// Create a stateless component with hooks
// NOTE: there are no type annotations, and the below code is 100% type safe!
export function App() {
  // load epic and reducer to the store
  useModule({
    epic,
    reducer,
    reducerPath: ['sample'],
  });

  // wrap actions with `dispatch`
  const { ping } = useActions(MyActions);
  // get state from redux store
  const { isPinging, lastPongAt } = useMappedState(state => state.sample);

  return (
    <div>
      <button disabled={isPinging} onClick={ping}>
        {isPinging ? 'pinging...' : 'ping'}
      </button>
      {lastPongAt && <div>last pong at {lastPongAt.toLocaleTimeString()}</div>}
    </div>
  );
}
```


MIT