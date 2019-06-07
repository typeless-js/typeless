import { createModule } from 'typeless';
import { SocketSymbol } from './symbol';

export const [useModule, SocketActions, getSocketState] = createModule(
  SocketSymbol
)
  .withActions({
    messageReceived: (container: 'a' | 'b' | 'c', text: string) => ({
      payload: { container, text },
    }),
    startC: null,
    stopC: null,
    $remounted: null,
    $mounted: null,
    $unmounted: null,
  })
  .withState<SocketState>();

export interface SocketState {
  a: string[];
  b: string[];
  c: string[];
  isCRunning: boolean;
}
