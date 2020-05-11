---
id: useSelector
title: useSelector
hide_title: true
sidebar_label: useSelector
---

# useSelector(selector[, equalityFn])

React Hook for accessing the Selector result.

#### Arguments

1. `selector: Selector`- a selector function created with `createSelector`.
2. `equalityFn?: (a: unknown, b: unknown) => boolean` - the function for checking that new result value of `Selector` equals the old value. For more info: [useMappedState](/api/useMappedState)

#### Returns

`{object}` - the object returned by `Selector`.

#### Example

Full example: [`createSelector`](/api/createSelector#example)

```tsx
// components/TodoList.tsx
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
