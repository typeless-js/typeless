import * as ReactDom from 'react-dom';
import { Subject, Observable } from 'rxjs';
import { Store } from './Store';
import { getDescription } from './utils';
import { Action, ActionLike } from './types';
import { Notify } from './Notify';
import { createOutputStream } from './createOutputStream';
import { StateLogger } from './StateLogger';

export class Registry {
  private nameCount: Map<string, number> = new Map();
  private displayNames: Map<symbol, string> = new Map();
  private storesMap: Map<symbol, Store> = new Map();
  private stores: Store[] = [];
  private input$!: Subject<Action>;
  private output$!: Observable<Action>;

  constructor() {
    this.initStreams();
  }

  reset() {
    this.nameCount.clear();
    this.displayNames.clear();
    this.storesMap.clear();
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

  getStore<TState = any>(name: symbol): Store<TState> {
    if (!this.storesMap.has(name)) {
      const store = new Store<TState>(name, this.getDisplayName(name));
      this.storesMap.set(name, store);
      this.stores.push(store);
    }
    return this.storesMap.get(name)!;
  }

  dispatch(action: ActionLike) {
    ReactDom.unstable_batchedUpdates(() => {
      const notify = new Notify();
      let stateLogger: StateLogger | null = null;
      if (process.env.NODE_ENV === 'development') {
        stateLogger = new StateLogger(this.stores);
      }
      if (stateLogger) {
        stateLogger.setState('prevState', this.getState());
      }
      for (const store of this.stores) {
        store.dispatch(action, notify);
      }
      if (stateLogger) {
        stateLogger.setState('nextState', this.getState());
        stateLogger.log(action);
      }
      for (const fn of notify.handlers) {
        fn();
      }
      this.input$.next(action as Action);
    });
  }

  getState() {
    const state: Record<string, any> = {};
    for (const store of this.stores) {
      if (store.state !== undefined) {
        state[store.displayName] = store.state;
      }
    }
    return state;
  }

  private initStreams() {
    this.input$ = new Subject();
    this.output$ = createOutputStream(this.input$, this.stores);
    this.output$.subscribe(action => {
      this.dispatch(action);
    });
  }
}
