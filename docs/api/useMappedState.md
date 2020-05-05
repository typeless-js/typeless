---
id: useMappedState
title: useMappedState
hide_title: true
sidebar_label: useMappedState
---

# useMappedState(stateGetters, mapperFn[, equalityFn][, deps])

React Hook for accessing the State.  
For most use cases it's enough to use a shorthand version `getCounterState.useState()`.

#### Arguments

1. `stateGetters: Array<StateGetter>` - the array of state getters created by `createdModule`.
2. `mapperFn: (state1: object, state2: object) => object` - the function for mapping provided states. It will be executed on every store change. The number of arguments is equal to the number of elements in `stateGetters`.
3. `equalityFn?: (a: unknown, b: unknown) => boolean` - the function for checking that new result value of `mapperFn` equals the old value. If returns `false`, `useMappedState` execute re-render Component.([Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) algorithm used by default)
4. `deps?: unknown[]` - the external dependencies used inside the hook. Omit it or pass `[]` if there are dependencies.

#### Returns

`{object}` - the object returned by `mapperFn`.

#### Example

```tsx
// symbol.ts
export const CounterSymbol = Symbol('counter');

// interface.ts
import { createModule } from 'typeless';
import { CounterSymbol } from './symbol';

export const [handle, CounterActions] = createModule(CounterSymbol)
  .withActions({
    startCount: null,
  })
  .withState<CounterState>();

interface CounterState {
  count: number;
  isLoading: number;
}

// module.tsx
import { handle, CounterActions, getCounterState } from './interface';

// mount reducer actions
handle.reducer({ count: 0, isLoading: false });

export function Counter() {
  handle();
  const { startCount } = useActions(CounterActions);
  const { isLoading, count } = useMappedState([getCounterState], state => state);
  // or
  // const { isLoading, count } = getCounterState.useState();

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
