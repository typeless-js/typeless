---
id: useActions
title: useActions
hide_title: true
sidebar_label: useActions
---



# useActions(actionCreators)
React Hook for binding actions creators with `dispatch`.  

#### Arguments
1. `actionCreators: {[action: string]: ActionCreator}` - the action creators created by [`createModule`](createModule).

#### Returns
`{[action: string]: Function}` - the mapped actions.


#### Example

```tsx
// symbol.ts
export const CounterSymbol = Symbol('counter');

// interface.ts
import { createModule } from 'typeless';
import { CounterSymbol } from './symbol';

export const [handle, CounterActions] = createModule(CounterSymbol)
  .withActions({
    increase: null,
  });

// module.tsx
import { CounterActions } from './interface';

export function Counter() {
  const { increase } = useActions(CounterActions);
  return <button onClick={increase}>increase</button>
}
```
