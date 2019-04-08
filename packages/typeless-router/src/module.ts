import { createModule } from 'typeless';
import * as Rx from 'typeless/rx';

const [withRouter, RouterActions, getRouterState] = createModule(
  Symbol('router')
)
  .withActions({
    $mounted: null,
    locationChange: (data: RouterLocation) => ({
      payload: data,
    }),
    push: (url: string) => ({
      payload: { url },
    }),
    replace: (url: string) => ({
      payload: { url },
    }),
  })
  .withState<RouterState>();

export { RouterActions, getRouterState };

export interface RouterLocation {
  hash: string;
  pathname: string;
  search: string;
  state?: object;
}

export interface RouterState {
  location: RouterLocation | null;
  prevLocation: RouterLocation | null;
}
const initialState: RouterState = {
  location: null,
  prevLocation: null,
};

export interface BaseHistory {
  location: RouterLocation;
  push(url: string): void;
  replace(url: string): void;
  listen(listener: (location: RouterLocation) => void): () => void;
}

export function createWithRouter(history: BaseHistory) {
  withRouter
    .epic()
    .on(
      RouterActions.$mounted,
      () =>
        new Rx.Observable(subscriber => {
          subscriber.next(RouterActions.locationChange(history.location));
          return history.listen(location => {
            subscriber.next(RouterActions.locationChange(location));
          });
        })
    )
    .on(RouterActions.push, location => {
      history.push(location as any);
      return Rx.empty();
    })
    .on(RouterActions.replace, location => {
      history.replace(location as any);
      return Rx.empty();
    });

  withRouter
    .reducer(initialState)
    .on(RouterActions.locationChange, (state, payload) => {
      state.prevLocation = state.location;
      state.location = payload;
    });

  return withRouter;
}
