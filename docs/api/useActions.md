---
id: useActions
title: useActions
hide_title: true
sidebar_label: useActions
---



# useActions(actionCreators)
React Hook for binding actions creators with `dispatch`.  

#### Arguments
1. `actionCreators: {[action: string]: ActionCreator}` - the action creators created by [`createActions`](createActions).

#### Returns
`{[action: string]: Function}` - the mapped actions.


#### Example

```tsx
import { createActions, useActions } from 'typeless';

export const MODULE = 'counter';
export const CounterActions = createActions(MODULE, {
  increase: null,
});

export function Counter() {
  const { increase } = useActions(CounterActions);
  // calling `increase()` is the same as:
  // dispatch({type: 'counter/INCREASE'})
  return <button onClick={increase}>increase</button>
}
```
