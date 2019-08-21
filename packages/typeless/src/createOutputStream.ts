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
import { mergeMap, observeOn, subscribeOn } from 'rxjs/operators';
import { Deps, Action } from './types';
import { Store } from './Store';
import { logAction, isAction } from './utils';

function getHandlers(stores: Store[], action: Action) {
  const [symbol, type] = action.type;
  return stores
    .filter(store => {
      if (!store.isEnabled || !store.epic) {
        return false;
      }
      const { handlers, moduleHandlers } = store.epic;

      return (
        moduleHandlers.has(symbol) ||
        (handlers.has(symbol) && handlers.get(symbol)!.has(type))
      );
    })
    .map(store => {
      const { handlers, moduleHandlers } = store.epic!;
      return [
        ...(handlers.has(symbol) && handlers.get(symbol)!.has(type)
          ? handlers.get(symbol)!.get(type)
          : []),
        ...(moduleHandlers.has(symbol) ? moduleHandlers.get(symbol) : []),
      ].map(handler => ({ store, handler }));
    })
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
    subscribeOn(queueScheduler),
    observeOn(queueScheduler),
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
              if (action === null) {
                // ignore if action is null
                return empty();
              }
              if (action === undefined) {
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
    })
  );
}
