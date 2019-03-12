import { createActions } from 'typeless';

export const MODULE = 'main';

export const MainActions = createActions(MODULE, {
  show: (viewType: ViewType) => ({ payload: { viewType } }),
});

export type ViewType = 'subA' | 'subB' | 'subC';

export interface MainState {
  viewType: ViewType | null;
}

declare module 'typeless/types' {
  interface DefaultState {
    main: MainState;
  }
}
