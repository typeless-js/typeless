import { createModule } from 'typeless';
import { MainSymbol } from './symbol';

export const [useModule, MainActions, getMainState] = createModule(MainSymbol)
  .withActions({
    show: (viewType: ViewType) => ({ payload: { viewType } }),
  })
  .withState<MainState>();

export type ViewType = 'subA' | 'subB' | 'subC';

export interface MainState {
  viewType: ViewType | null;
}
