import { createActions } from 'typeless';

export const MODULE = 'cat';

export const CatActions = createActions(MODULE, {
  loadCat: null,
  cancel: null,
  catLoaded: (cat: Cat) => ({ payload: { cat } }),
  errorOcurred: (error: string) => ({ payload: { error } }),
});

type ViewType = 'loading' | 'details' | 'error';

interface Cat {
  imageUrl: string;
}

export interface CatState {
  viewType: ViewType;
  cat: Cat | null;
  error: string;
}

declare module 'typeless/types' {
  interface DefaultState {
    cat: CatState;
  }
}
