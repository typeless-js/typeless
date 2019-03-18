---
id: useModule
title: useModule
hide_title: true
sidebar_label: useModule
---

# useModule(options)
React Hook for loading a module. It should be the first statement in your component. Always call `useModule` before calling `useMappedState`.

#### Arguments
The `options` argument has following properties:  
1. `epic: Epic`- the epic to load.
2. `reducer: Reducer`- the reducer to load.
3. `reducerPath: string[]`- the path where the reducer will be loaded inside RootReducer.
4. `actions?: {[action: string]: ActionCreator}` - the optional lifecycle actions. See [`createActions`](createActions) for available actions.

#### Returns
`{void}`


#### Example

```ts
import { useModule, createEpic, createReducer } from 'typeless';
import { CounterActions, CounterState, MODULE } from './interface';

const epic = createEpic(MODULE)
const initialState: CounterState = { };

const reducer = createReducer(initialState)

export default function CounterModule() {
  useModule({
    epic,
    reducer,
    reducerPath: ['counter'],
    actions: CounterActions
  });

  return <Counter />;
}
```