import { createActions } from 'typeless';

export const MODULE = 'subB';

export const SubBActions = createActions(MODULE, {
  decrease: null,
  $unmounting: null,
});

export interface SubBState {
  counter: number;
}

declare module 'typeless/types' {
  interface DefaultState {
    subB: SubBState;
  }
}
