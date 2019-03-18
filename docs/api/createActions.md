---
id: createActions
title: createActions
hide_title: true
sidebar_label: createActions
---

# createActions(ns, actionMap)
Create action creators for the given namespace. The `action.type` property will be automatically generated based on the given namespace, and function name.

#### Arguments
1. `ns: string`- the prefix used in `action.type`.
2. `actionMap: {[name: string]: Function | null}` the map with action creators. Each function should wrap input arguments into an object with `payload` property. If the function doesn't have any arguments, you can provide `null` instead.  

   There are special **lifecycle actions** dispatched automatically by **useModule**. Actions are only dispatched when you defined them in `createActions`.
    - `$mounted` - dispatched **after** the module was mounted.
    - `$remounted` - dispatched **after** the module was remounted during HMR.
    - `$unmounting` - dispatched **before** the module was unmounted.
    - `$unmounted` - dispatched **after** the module was unmounted. 



#### Returns
`{[name: string]: Function}` - the generated action creators


#### Example

```ts
import { createActions } from 'typeless';

const UserActions = createActions('user', {
  fetchUser: (id: number) => ({ payload: { id } }),
  deleteUser: null,
  // lifecycle actions, optional
  $mounted: null,
  $remounted: null
  $unmounting: null,
  $unmounted: null,
});


UserActions.fetchUser(1)
// => { type: 'user/FETCH_USER', payload: { id } }


UserActions.deleteUser()
// => { type: 'user/DELETE_USER' }
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
**Why?** The log will be harder to read, if there are too many actions.