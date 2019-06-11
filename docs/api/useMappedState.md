---
id: useMappedState
title: useMappedState
hide_title: true
sidebar_label: useMappedState
---

# useMappedState(fn, deps)
React Hook for accessing the State.  
For most use cases it's enough to use a shorthand version `getCounterState.useState()`.


#### Arguments
1. `stateGetters: Array<StateGetter>` - the array of state getters created by `createdModule`.
2. `deps: (state1: object, state2: object) => object` - the function for mapping provided states. It will be executed on every store change. The number of arguments is equal to the number of elements in `stateGetters`.
3. `deps?: any[]` - the external dependencies used inside the hook. Omit it or pass `[]` if there are dependencies.

#### Returns
`{object}` - the object returned by `fn`.


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
handle.reducer({count: 0, isLoading: false});

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