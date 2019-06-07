---
id: createModule
title: createModule
hide_title: true
sidebar_label: createModule
---

# createModule(symbol)
Create a new module for a given symbol. Each symbol should be associated with exactly one module.  

#### Arguments
1. `symbol: Symbol`- the symbol used to identify the module.


A module can be created with 3 variations:
- with actions 
```ts
const [handle, Actions] = createModule(symbol).withActions(actionMap);
```

- with state
```ts
const [handle, getState] = createModule(symbol).withState<MyState>();
```

- with state and actions
```ts
const [handle, Actions, getState] = createModule(symbol)
  .withActions(actionMap)
  .withState<MyState>();
```

#### Methods

1. `.withActions(actionMap: {[name: string]: Function | null})` Add actions to the module. Argument `actionMap` is the map with action creators. Each function should wrap input arguments into an object with `payload` property. If the function doesn't have any arguments, you can provide `null` instead.  

   There are special **lifecycle actions** dispatched automatically by **useModule**. Actions are only dispatched when you define them in `createActions`.
    - `$init` - dispatched **immediately** after the `useModule` is invoked. Useful if you need to set initial data, and you want to avoid rendering component with the initial state.
    - `$mounted` - dispatched **after** the module was mounted.
    - `$remounted` - dispatched **after** the module was remounted during HMR.
    - `$unmounting` - dispatched **before** the module was unmounted.
    - `$unmounted` - dispatched **after** the module was unmounted. 

2. `.withState<State>()` Add state to the module. You must use this method to be able to attach a reducer.


#### Returned objects
`handle: Handle` the module handle that allows attaching epic handlers and reducer.  

`Actions:  {[name: string]: Function}` the action creators.

`getState: () => State` the state getter.


#### Example

```tsx
// interface.ts
export const UserSymbol = Symbol('user');

// module.ts
import { createModule } from 'typeless';
import { UserSymbol } from './interface';

export const [handle, UserActions, getUserState] = createModule(UserSymbol)
  .withActions({
    fetchUser: (id: number) => ({ payload: { id } }),
    deleteUser: null,
    // lifecycle actions, optional
    $init: null,
    $mounted: null,
    $remounted: null
    $unmounting: null,
    $unmounted: null,
  })
  .withState<UserState>;

export interface UserState {
  userId: number | null;
}

// module.ts
import { handle } from './module';

handle.epic().on(...)

handle.reducer({userId: null}).on(....)

export function UserModule() {
  handle();

  return <div>...</div>
}

// Example usage

UserActions.fetchUser(1)
// => { type: 'user/FETCH_USER', payload: { id } }

UserActions.deleteUser()
// => { type: 'user/DELETE_USER' }

getUserState();
// => { userId: null }

function MyApp() {
  return (
    <div>
      <UserModule />
    </div>
  );
}
```


### Best Practices
1. Use lowercase string for `ns`.  
**Why?** It's a common convention.
```ts
// BAD
const UserActions = createActions('USER', { })

// GOOD
const UserActions = createActions('user', { })
```

2. If you create a library, prefix it with `@@`.  
**Why?** Avoid name collisions.
```ts
// BAD
const RouterActions = createActions('router', { })

// GOOD
const UserActions = createActions('@@router', { })
```

3. Always wrap arguments inside an object.  
**Why?** Prefer using a destructing inside reducer and epic handlers. Refactoring and renaming are much more straightforward. 
```ts
// BAD
const UserActions = createActions('user', {
  fetchUser: (id: number) => ({ payload: id }), 
});

// GOOD
const UserActions = createActions('user', {
  fetchUser: (id: number) => ({ payload: { id }), 
});
```

4. Don't depend on 3rd party libraries.  
**Why?** Action creators should be lightweight. If you refer to other libraries, the initial chunk will have many KB.

```ts
// BAD
import moment from 'moment';
const UserActions = createActions('user', {
  setNow: () => ({ payload: {date: moment() }), 
});

// GOOD
const UserActions = createActions('user', {
  setNow: () => ({ payload: {date: new Date() }), 
});
```

5. Don't define lifecycle methods if you don't use them in epics or reducers.  
**Why?** The log will be harder to read if there are too many actions.