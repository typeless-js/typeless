import { createModule } from 'typeless';
import { SubCSymbol } from './symbol';

export const [useModule, SubCActions, getSubCState] = createModule(SubCSymbol)
  .withActions({
    double: null,
  })
  .withState<SubCState>();

export interface SubCState {
  counter: number;
}
