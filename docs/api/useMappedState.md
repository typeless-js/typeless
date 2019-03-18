---
id: useMappedState
title: useMappedState
hide_title: true
sidebar_label: useMappedState
---

# useMappedState(fn, deps)
React Hook for accessing the Redux State.  
It's a wrapper for [`redux-react-hook`](https://github.com/facebookincubator/redux-react-hook).


#### Arguments
1. `fn: (state: object) => object` - the function for mapping global state. It will be executed on every store change.
2. `deps?: any[]` - the external dependencies used inside the hook. Omit it or pass `[]` if there are dependencies.

#### Returns
`{object}` - the object returned by `fn`.


#### Example

```tsx
export function Counter() {
  const { startCount } = useActions(CounterActions);
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