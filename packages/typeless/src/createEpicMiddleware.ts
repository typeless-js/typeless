/**
 * Based on https://github.com/redux-observable/redux-observable/blob/9a00294905e33d06774aa8c618b4d64e8427891e/src/createEpicMiddleware.js
 *
 * MIT
 */
import { Subject, queueScheduler } from 'rxjs';
import { observeOn, subscribeOn } from 'rxjs/operators';
import { StateObservable } from './StateObservable';
import { Store, Middleware } from 'redux';
import { batchUpdate } from './actions';
import { RootEpic } from './RootEpic';

export function createEpicMiddleware<S = any>(rootEpic: RootEpic<S>) {
  let store: Store<any>;

  const epicMiddleware: Middleware<S> = (_store: Store<any>) => {
    store = _store;
    const actionSubject$ = new Subject().pipe(
      observeOn(queueScheduler)
    ) as Subject<any>;
    const stateSubject$ = new Subject().pipe(
      observeOn(queueScheduler)
    ) as Subject<any>;
    const state$ = new StateObservable(stateSubject$, store.getState());

    const result$ = rootEpic
      .handle({
        action$: actionSubject$,
        getState: () => store.getState(),
        state$,
      })
      .pipe(
        subscribeOn(queueScheduler),
        observeOn(queueScheduler)
      );

    result$.subscribe(value => {
      store.dispatch(value as any);
    });

    return next => {
      return action => {
        // Downstream middleware gets the action first,
        // which includes their reducers, so state is
        // updated before epics receive the action
        const result = next(action);

        // It's important to update the state$ before we emit
        // the action because otherwise it would be stale
        stateSubject$.next(store.getState());
        if (action.type === batchUpdate.toString()) {
          action.payload.forEach((item: any) => {
            actionSubject$.next(item);
          });
        } else {
          actionSubject$.next(action);
        }

        return result;
      };
    };
  };

  return epicMiddleware;
}
