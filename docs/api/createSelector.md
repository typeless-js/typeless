---
id: createSelector
title: Create Selector
hide_title: true
sidebar_label: createSelector
---

# createSelector(...selectors, resultFunc)
Create a memoized selector from the state getters.

#### Arguments
1. `selectors: ...(Selector | [StateGetter, (state) => result])`- an arguments of input selector. Each element can be either:
    - another selector created with `createSelector`
    - a tuple with two elements: a state getter created by `createModule`, a selector function
2. `resultFunc: (...args: any) => any` - the result function for computing input arguments.


#### Returns
`() => object` - the memoized function for returning computed state.


#### Example

```tsx
// symbol.ts
export const TodoSymbol = Symbol('todo');

// interface.ts
import { createModule } from 'typeless';
import { TodoSymbol } from './interface';

export const [handle, TodoActions, getTodoState] = createModule(TodoSymbol)
  .withActions({ })
  .withState<TodoState>;

export interface TodoState {
    filter: 'all' | 'not-deleted';
    todos: Array<{
      id: number;
      text: string;
      isDeleted: boolean;
    }>
}

// selectors.ts
import { createSelector } from 'typeless';
import { getTodoState } from './interface';

export const getTodos = createSelector(
  [getTodoState, state => state.filter],
  [getTodoState, state => state.todos],
  (filter, todos) => {
    if (filter === 'all') {
      return todos;
    }
    return todos.filter(x => !x.isDeleted);
  }
);

// components/TodoList.tsx
import { useSelector } from 'typeless';
import { getTodos } from '../selectors';

function TodoList() {
  // use your selector with useSelector
  const todos = useSelector(getTodos);
  return (
    <div>
      {todos.map(todo => (
        <Todo todo={todo} key={todo.id} />
      ))}
    </div>
  );
}
```
