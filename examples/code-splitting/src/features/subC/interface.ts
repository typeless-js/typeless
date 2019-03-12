import { createActions } from 'typeless';

export const MODULE = 'subC';

export const SubCActions = createActions(MODULE, {
  double: null,
});

export interface SubCState {
  counter: number;
}

declare module 'typeless/types' {
  interface DefaultState {
    subC: SubCState;
  }
}
