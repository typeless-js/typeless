import { createModule } from 'typeless';
import { SubBSymbol } from './symbol';

export const [useModule, SubBActions, getSubBState] = createModule(SubBSymbol)
  .withActions({
    decrease: null,
    $unmounting: null,
  })
  .withState<SubBState>();

export interface SubBState {
  counter: number;
}
