import { createModule } from 'typeless';
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
} from './utils';

const [withRouter, RouterActions, getRouterState] = createModule(
  Symbol('router')
)
  .withActions({
    $mounted: null,
    $unmounted: null,
    locationChange: (data: RouterLocation) => ({
      payload: data,
    }),
    push: (location: LocationChange) => ({
      payload: { location },
    }),
    replace: (location: LocationChange) => ({
      payload: { location },
    }),
  })
  .withState<RouterState>();

export { RouterActions, getRouterState };

const initialState: RouterState = {
  location: null,
  prevLocation: null,
};

export function createWithRouter(
  options: HistoryOptions = { type: 'browser' }
) {
  ensureHTML5History();

  withRouter
    .epic()
    .on(RouterActions.$mounted, (_, { action$ }) => {
      return new Rx.Observable(subscriber => {
        const notify = () => {
          subscriber.next(
            RouterActions.locationChange({
              ...getLocationProps(options.type),
              type: 'replace',
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
        Rx.takeUntil(action$.pipe(Rx.waitForType(RouterActions.$unmounted)))
      );
    })
    .on(RouterActions.push, ({ location }) => {
      history.pushState(null, '', getFullURL(options.type, location));
      return RouterActions.locationChange({
        ...getLocationChangeProps(location),
        type: 'push',
      });
    })
    .on(RouterActions.replace, ({ location }) => {
      history.replaceState(null, '', getFullURL(options.type, location));
      return RouterActions.locationChange({
        ...getLocationChangeProps(location),
        type: 'replace',
      });
    });

  withRouter
    .reducer(initialState)
    .on(RouterActions.locationChange, (state, payload) => {
      state.prevLocation = state.location;
      state.location = payload;
    });

  return withRouter;
}
