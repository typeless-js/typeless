import { Subject, queueScheduler, merge, empty, defer, from, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { observeOn, subscribeOn } from 'rxjs/operators';
import { ActionLike, Deps } from './types';
import { Store } from './Store';
import { logAction, isAction } from './utils';

function getHandlers(stores: Store[], action: ActionLike) {
  return stores
    .filter(
      store =>
        store.isEnabled && store.epic && store.epic.handlers.has(action.type)
    )
    .map(store =>
      store.epic.handlers.get(action.type).map(handler => ({ store, handler }))
    )
    .reduce((ret, arr) => {
      ret.push(...arr);
      return ret;
    }, []);
}

export function createOutputStream(
  action$: Subject<ActionLike>,
  stores: Store[]
) {
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
            const result = handler(sourceAction.payload, deps, sourceAction);
            if (Array.isArray(result)) {
              return from(result);
            }
            if (isAction(result)) {
              return of(result);
            }
            return result;
          }).pipe(
            mergeMap((action: any) => {
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
