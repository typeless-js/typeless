import { createModule } from 'typeless';
import { SubASymbol } from './symbol';

export const [useModule, SubAActions, getSubAState] = createModule(SubASymbol)
  .withActions({
    increase: null,
  })
  .withState<SubAState>();

export interface SubAState {
  counter: number;
}
