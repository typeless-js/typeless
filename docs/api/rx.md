---
id: rx
title: Rx
hide_title: true
sidebar_label: Rx
---

# Rx
`Rx` is a convenience re-export of rxjs. Check [this issue](https://github.com/ReactiveX/rxjs/issues/3622) for motivation.

The entry point contains:
- all exports from `rxjs/operators`
- Following exports from `rxjs`:  
 `Subject`, `forkJoin`, `empty`, `of`, `timer`, `from`, `defer`, `Observable`, `interval`
- Renamed exports from `rxjs`:
  - `concat` -> `concatObs`
  - `merge` -> `mergeObs`
  - `race` -> `raceObs`
  - `throwError` -> `throwObs`
- Following exports from `rxjs/internal-compatibility`:  
`fromPromise`

## Additional operators

### `ofType(actionCreator)` 
Filter actions based on the provided action creator or action creators.
#### Arguments
1. `actionCreator: AC | AC[]` - the action creator or array of action creators.
#### Returns
`{OperatorFunction}` - the rxjs operator function.

#### Example
```ts
import * as Rx from 'typeless/rx';
import { createEpic, createActions } from 'typeless';

const MyActions = createActions('module', {
  loadUser: null,
  userLoaded: (user: User) => ({ payload: { user } }),
  cancel: null,
});

const epic = createEpic('module')
  .on(MyActions.loadUser, (_, { action$ }) =>
    API.loadUser().pipe(
      Rx.map(user => MyActions.userLoader(user)),
      // cancel operation if `MyActions.cancel()` is dispatched
      Rx.takeUntil(action$.pipe(Rx.ofType(MyActions.cancel)))
    )
  );
```
 


### waitForType(actionCreator)
Wait for a single action creator.
#### Arguments
1. `actionCreator: AC ` - the action creator to wait for.
#### Returns
`{OperatorFunction}` - the rxjs operator function.

#### Example
```ts
import * as Rx from 'typeless/rx';
import { createEpic, createActions } from 'typeless';

const MyActions = createActions('module', {
  deleteUser: null,
  userDeleted: null,
  errorOccurred: null,
  confirmDelete: (confirm: boolean) => ({ payload: { confirm } }),
});

const epic = createEpic('module')
  // show a confirmation dialog and wait for Yes/No click
  .on(MyActions.deleteUser, (_, { action$ }) =>
    action$.pipe(
      Rx.waitForType(MyActions.confirmDelete),
      Rx.filter(action => action.payload.confirm)
      Rx.mergeMap(() => API.deleteUser()),
      Rx.mapTo(MyActions.userDeleted()),
      Rx.catchError(e => {
        console.error(e);
        return Rx.of(MyActions.errorOccurred());
      })
    )
  );
```