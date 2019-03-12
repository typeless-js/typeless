import { createActions } from 'typeless';

export const MODULE = 'socket';

export const SocketActions = createActions(MODULE, {
  messageReceived: (container: 'a' | 'b' | 'c', text: string) => ({
    payload: { container, text },
  }),
  startC: null,
  stopC: null,
  $remounted: null,
  $mounted: null,
  $unmounted: null,
});

export interface SocketState {
  a: string[];
  b: string[];
  c: string[];
  isCRunning: boolean;
}

declare module 'typeless/types' {
  interface DefaultState {
    socket: SocketState;
  }
}
