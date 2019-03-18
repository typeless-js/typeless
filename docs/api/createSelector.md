---
id: createSelector
title: Create Selector
hide_title: true
sidebar_label: createSelector
---

# createSelector(selectors, resultFunc)
Create a memoized selector.  It's very similar to [reselect](https://github.com/reduxjs/reselect/).

#### Arguments
1. `selectors: Array<(state: State) => any>`- an array of input selectors. Each value returned by the selected will be passed to `resultFunc` as an argument.
2. `resultFunc: (...args: any) => any` - the result function for computing input arguments.


#### Returns
`{(state: State) => object}` - the memoized function for mapping Redux state.


#### Example

```ts
// features/todos/interface.ts
declare module 'typeless/types' {
  interface DefaultState {
    filter: 'all' | 'not-deleted';
    todos: Array<{
      id: number;
      text: string;
      isDeleted: boolean;
    }>;
  }
}
```

```ts
// features/todos/selectors.ts
import { createSelector } from 'typeless';

const getTodos = createSelector(
  [state => state.filter, state => state.todos],
  (filter, todos) => {
    if (filter === 'all') {
      return todos;
    }
    return todos.filter(x => !x.isDeleted);
  }
);

```
```tsx
// features/todos/selectors.ts
function TodoList() {
  // use your selector with useMappedState
  const { todos } = useMappedState(state => ({
    todos: getTodos(todos),
  }));
  return (
    <div>
      {todos.map(todo => (
        <Todo todo={todo} key={todo.id} />
      ))}
    </div>
  );
}
```


### Best Practices
1. Input selectors must be immutable.  
**Why?** Input selectors are not memoized. If you return a new object, it will break the caching functionality, and you will lose all benefits of using `createSelector`.
```ts
// VERY BAD
createSelector(
  [
    // it creates a new instance of Array
    state => state.todos.filter(x => x.deleted)
  ],
  (todos) => {
    // code
  }
)

// GOOD
createSelector(
  [
    // always return the original object or array
    state => state.todos
  ],
  (todos) => {
    // code
  }
)
```

2. Don't use `createSelector` for simple and immutable operations.  
**Why?** Such selectors don't improve performance, and only add extra complexity.

```ts
// BAD
const getFirstTodo = createSelector(
  [
    state => state.todos
  ],
  (todos) => todos[0]
)

// GOOD
function TodoList() {
  // directly pick `firstTodo` in `useMappedState`
  // there is no different in performance
  const { firstTodo } = useMappedState(state => ({
    firstTodo: state.todos[0],
  }));
  // code
}
```
