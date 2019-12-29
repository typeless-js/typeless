import { createModule } from 'typeless';
import { CatSymbol } from './symbol';

export const [useModule, CatActions, getCatState] = createModule(CatSymbol)
  .withActions({
    loadCat: null,
    cancel: null,
    catLoaded: (cat: Cat) => ({ payload: { cat } }),
    errorOcurred: (error: string) => ({ payload: { error } }),
  })
  .withState<CatState>();

export interface CounterState {
  isLoading: boolean;
  count: number;
}

type ViewType = 'loading' | 'details' | 'error';

interface Cat {
  imageUrl: string;
}

export interface CatState {
  viewType: ViewType;
  cat: Cat | null;
  error: string;
}
