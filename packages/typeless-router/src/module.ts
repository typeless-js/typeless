import { createModule, ActionLike } from 'typeless';
import * as Rx from 'typeless/rx';
import {
  HistoryOptions,
  RouterLocation,
  LocationChange,
  RouterState,
} from './types';
import {
  ensureHTML5History,
  getFullURL,
  getLocationChangeProps,
  getLocationProps,
  redirectWithLeadingHash,
} from './utils';

export const RouterSymbol = Symbol('router');

const [useRouter, RouterActions, getRouterState] = createModule(RouterSymbol)
  .withActions({
    $init: null,
    $unmounted: null,
    dispose: null,
    locationChange: (location: RouterLocation) => ({
      payload: location,
    }),
    push: (location: LocationChange) => ({
      payload: location,
    }),
    replace: (location: LocationChange) => ({
      payload: location,
    }),
  })
  .withState<RouterState>();

export { RouterActions, getRouterState };

const initialState: RouterState = {
  location: null,
  prevLocation: null,
};

export function createUseRouter(options: HistoryOptions = { type: 'browser' }) {
  ensureHTML5History();

  useRouter.reset();

  useRouter
    .epic()
    .on(RouterActions.$init, (_, { action$ }) => {
      if (options.type === 'hash') {
        redirectWithLeadingHash();
      }

      return new Rx.Observable<ActionLike>(subscriber => {
        const notify = () => {
          subscriber.next(
            RouterActions.locationChange({
              ...getLocationProps(options.type),
              type: 'push',
            })
          );
        };
        const onChange = () => {
          notify();
        };
        notify();
        window.addEventListener('popstate', onChange);
        return () => {
          window.removeEventListener('popstate', onChange);
        };
      }).pipe(
        Rx.takeUntil(action$.pipe(Rx.waitForType(RouterActions.dispose)))
      );
    })
    .on(RouterActions.push, location => {
      history.pushState(null, '', getFullURL(options.type, location));
      return RouterActions.locationChange({
        ...getLocationChangeProps(location),
        type: 'push',
      });
    })
    .on(RouterActions.replace, location => {
      history.replaceState(null, '', getFullURL(options.type, location));
      return RouterActions.locationChange({
        ...getLocationChangeProps(location),
        type: 'replace',
      });
    });

  useRouter
    .reducer(initialState)
    .on(RouterActions.locationChange, (state, location) => {
      state.prevLocation = state.location;
      state.location = location;
    });

  return useRouter;
}
