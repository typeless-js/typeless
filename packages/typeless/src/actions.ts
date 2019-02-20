import { createActions } from './createActions';

export const { batchUpdate } = createActions('@@typeless', {
  batchUpdate: (actions: object[]) => ({ payload: actions }),
});
