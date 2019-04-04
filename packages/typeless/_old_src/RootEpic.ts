import { merge } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Deps, DefaultState } from './types';
import { Epic } from './Epic';

export class RootEpic<TState = DefaultState> {
  private tree: { [x: string]: Epic<TState> };
  constructor() {
    this.tree = {};
  }
  handle(deps: Deps<TState>) {
    return deps.action$.pipe(
      mergeMap(action => {
        const handlers = Object.values(this.tree)
          .map(epic => epic.handlers[action.type])
          .filter(x => x)
          .reduce((ret, arr) => {
            ret.push(...arr);
            return ret;
          }, []);
        return merge(...handlers.map(fn => fn(deps)(action)));
      })
    );
  }

  addEpic(epic: Epic<TState>) {
    this.tree[epic.epicName] = epic;
  }

  removeEpic(epicName: string) {
    delete this.tree[epicName];
  }

  hasEpic(epicName: string) {
    return !!this.tree[epicName];
  }
}
