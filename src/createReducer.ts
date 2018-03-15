import { ChainedReducer } from './ChainedReducer';

export function createReducer<S>(initial: S) {
  return new ChainedReducer(initial).asReducer();
}
