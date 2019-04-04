import { Reducer, ActionLike } from './types';
import { batchUpdate } from './actions';

export const withBatch = <S>(baseReducer: Reducer<S>) => (
  state: S,
  action: ActionLike
) => {
  if (action.type === batchUpdate.toString()) {
    return (action.payload as ActionLike[]).reduce(
      (currentState, currentAction) => baseReducer(currentState, currentAction),
      state
    );
  }
  return baseReducer(state, action);
};
