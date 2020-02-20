import { empty, merge, Observable, queueScheduler, Subject } from 'rxjs';
import { mergeMap, observeOn, subscribeOn } from 'rxjs/operators';
import { Store } from './Store';
import { Action, Deps } from './types';

export function createOutputStream(
  action$: Subject<Action>,
  stores: Store[]
): Observable<Action> {
  const deps = { action$: action$ as Deps['action$'] };
  return action$.pipe(
    subscribeOn(queueScheduler),
    observeOn(queueScheduler),
    mergeMap(sourceAction => {
      const handlers = stores
        .map(store => store.getOutputStream(sourceAction, deps))
        .filter(handler => handler !== null)
        .reduce((ret, arr) => [...ret, ...arr], [])!;

      if (handlers.length === 0) {
        return empty();
      } else {
        return merge(...handlers);
      }
    })
  );
}
