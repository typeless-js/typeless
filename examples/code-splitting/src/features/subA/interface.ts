import { createActions } from 'typeless';

export const MODULE = 'subA';

export const SubAActions = createActions(MODULE, {
  increase: null,
});

export interface SubAState {
  counter: number;
}

declare module 'typeless/types' {
  interface DefaultState {
    subA: SubAState;
  }
}
