import { Subject, Observable } from 'rxjs';
import { Store } from './Store';
import { snakeCase, getDescription } from './utils';
import { Action, ActionLike } from './types';
import { Notify } from './Notify';
import { createOutputStream } from './createOutputStream';

export class Registry {
  private nameCount: Map<string, number> = new Map();
  private displayNames: Map<symbol, string> = new Map();
  private storesMap: Map<symbol, Store> = new Map();
  private stores: Store[] = [];
  private actionSymbols: Map<symbol, Map<string, symbol>> = new Map();
  private input$!: Subject<Action>;
  private output$!: Observable<Action>;

  constructor() {
    this.initStreams();
  }

  reset() {
    this.nameCount.clear();
    this.displayNames.clear();
    this.storesMap.clear();
    this.actionSymbols.clear();
    this.stores = [];
    this.initStreams();
  }

  getDisplayName(name: symbol) {
    const description = getDescription(name);
    if (!this.displayNames.has(name)) {
      let count = this.nameCount.get(description) || 0;
      count++;
      this.nameCount.set(description, count);
      const displayName = count > 1 ? `${description}#${count}` : description;
      this.displayNames.set(name, displayName);
    }
    return this.displayNames.get(name)!;
  }

  getStore(name: symbol) {
    if (!this.storesMap.has(name)) {
      const store = new Store(name, this.getDisplayName(name));
      this.storesMap.set(name, store);
      this.stores.push(store);
    }
    return this.storesMap.get(name)!;
  }

  dispatch(action: ActionLike) {
    const notify = new Notify();
    for (const store of this.stores) {
      store.dispatch(action, notify);
    }
    for (const fn of notify.handlers) {
      fn();
    }
    this.input$.next(action as Action);
  }

  getActionSymbol(name: symbol, action: string) {
    if (!this.actionSymbols.has(name)) {
      this.actionSymbols.set(name, new Map());
    }
    const actionMap = this.actionSymbols.get(name)!;
    if (!actionMap.has(action)) {
      const displayName = this.getDisplayName(name);
      const fullName = displayName + '/' + snakeCase(action).toUpperCase();
      actionMap.set(action, Symbol(fullName));
    }
    return actionMap.get(action);
  }

  private initStreams() {
    this.input$ = new Subject();
    this.output$ = createOutputStream(this.input$, this.stores);
    this.output$.subscribe(action => {
      this.dispatch(action);
    });
  }
}

export const registry = new Registry();
