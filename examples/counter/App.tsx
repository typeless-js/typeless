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
