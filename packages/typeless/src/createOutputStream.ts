import {
  Subject,
  queueScheduler,
  merge,
  empty,
  defer,
  from,
  of,
  Observable,
} from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { observeOn, subscribeOn } from 'rxjs/operators';
import { Deps, Action } from './types';
import { Store } from './Store';
import { logAction, isAction } from './utils';

function getHandlers(stores: Store[], action: Action) {
  return stores
    .filter(
      store =>
        store.isEnabled && store.epic && store.epic.handlers.has(action.type)
    )
    .map(store =>
      store
        .epic!.handlers.get(action.type)!
        .map(handler => ({ store, handler }))
    )
    .reduce((ret, arr) => {
      ret.push(...arr);
      return ret;
    }, []);
}

export function createOutputStream(
  action$: Subject<Action>,
  stores: Store[]
): Observable<Action> {
  const deps = { action$: action$ as Deps['action$'] };
  return action$.pipe(
    mergeMap(sourceAction => {
      const handlers = getHandlers(stores, sourceAction);
      if (!handlers.length) {
        return empty();
      }
      return merge(
        ...handlers.map(({ store, handler }) => {
          return defer(() => {
            const name = store.displayName;
            if (process.env.NODE_ENV === 'development') {
              logAction(name, sourceAction);
            }
            const result = handler(
              sourceAction.payload,
              deps,
              sourceAction
            ) as (Observable<Action> | Action | Action[]);
            if (Array.isArray(result)) {
              return from(result);
            }
            if (isAction(result)) {
              return of(result);
            }
            return result;
          }).pipe(
            mergeMap((action: Action) => {
              if (action == null) {
                console.error('Undefined action returned in epic.', {
                  action,
                  store: name,
                });
                return empty();
              }
              if (!isAction(action)) {
                console.error('Invalid action returned in epic.', {
                  sourceAction,
                  action,
                  store: name,
                });
                return empty();
              }
              return of(action);
            })
          );
        })
      );
    }),
    subscribeOn(queueScheduler),
    observeOn(queueScheduler)
  );
}
