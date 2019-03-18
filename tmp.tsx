import * as Rx from 'typeless/rx';
import { createEpic, createActions } from 'typeless';

const MyActions = createActions('module', {
  deleteUser: null,
  confirmDelete: (confirm: boolean) => ({ payload: { confirm } }),
});

const epic = createEpic('module')
  //
  .on(MyActions.deleteUser, (_, { action$ }) =>
    action$.pipe(
      Rx.waitForType(MyActions.confirmDelete),
      Rx.mergeMap(action => {
        if (!action.payload.confirm) {
          return Rx.empty();
        }
        return API.deleteUser();
      })
    )
  );
