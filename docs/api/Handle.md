---
id: Handle
title: Handle
hide_title: true
sidebar_label: Handle
---

# Handle
Handle is an object created by `createModule`. It allows attaching epic handlers and reducers.

## Mounting handle
Returned handle by `createModule` is a React hook function. Invoke it to mount it in the application.

#### Example

```tsx
// module.ts
import { handle } from './interface';

// export it with `use` prefix
export const useMyModule = handle;

// or use directly in the module component
export function MyModule() {
  handle();

  return (
    <div>foo</div>
  )
}
```

## Methods
### `epic()` 
Initialize a new epic. Epics are used to handle side effects.  
Calling `epic()` multiple times will reset previously created epic.
#### Returns
[`{Epic}`](/api/Epic) - the created epic

#### Example
```ts
import { handle } from './interface';

handle.epic()
  .on(SomeActions.foo, () => {...})
  .on(SomeActions.bar, () => {...})
```

---

### `reducer(initialState: TState)` 
Initialize a new chained reducer. Reducers are used to modify the state.  
Calling `reducer()` multiple times will reset previously created reducer.
#### Arguments
1. `initialState: object`- the initial state.
#### Returns
[`{ChainedReducer}`](/api/ChainedReducer) - the created chained reducer

#### Example
```ts
import { handle } from './interface';

handle.reducer({user: null, isLoading: false})
  .on(SomeActions.foo, () => {...})
  .on(SomeActions.bar, () => {...})
```

---

### `reset()` 
Reset created epic and reducer.
