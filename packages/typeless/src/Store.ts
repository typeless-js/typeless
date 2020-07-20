import { Reducer, ActionLike, Action, Deps } from './types';
import { Epic } from './Epic';
import { Notify } from './Notify';
import { logAction } from './utils';

type Listener = () => void;

export class Store<TState = any> {
  public isEnabled: boolean = false;
  public state: TState | undefined = undefined;
  public reducer: Reducer<TState> | null = null;
  public epic: Epic | null = null;
  private listeners: Listener[] = [];
  private usageCount: number = 0;
  private isStateInited = false;

  constructor(public name: symbol, public displayName: string) {}

  initState() {
    if (this.reducer && !this.isStateInited) {
      this.state = this.reducer(undefined, {
        type: [Symbol('__INIT__'), 'init'],
      });
      // don't reset state if the module is remounted
      // for example when navigating from PageA -> PageB -> PageA
      // PageA should reset its state manually
      this.isStateInited = true;
    }
  }

  enable({
    epic,
    reducer,
  }: {
    epic: Epic | null;
    reducer: Reducer<TState> | null;
  }) {
    this.usageCount++;
    this.epic = epic || null;
    this.reducer = reducer || null;
    this.isEnabled = true;
  }

  disable() {
    this.usageCount--;
    if (!this.usageCount) {
      this.epic = null;
      this.reducer = null;
      this.isEnabled = false;
    }
  }

  dispatch(action: ActionLike, notify?: Notify) {
    if (!this.isEnabled) {
      return;
    }
    if (this.reducer) {
      const nextState = this.reducer(this.state, action);
      if (nextState !== this.state) {
        this.state = nextState;
        const notifyFn = () => {
          for (const listener of this.listeners) {
            listener();
          }
        };
        if (notify) {
          notify.add(notifyFn);
        } else {
          notifyFn();
        }
      }
    }
  }

  getOutputStream(action: Action, deps: Deps) {
    if (this.isEnabled && this.epic != null) {
      return this.epic.toStream(action, deps, this.displayName, () => {
        if (process.env.NODE_ENV === 'development') {
          logAction(this.displayName, action);
        }
      });
    } else {
      return null;
    }
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners.splice(this.listeners.indexOf(listener), 1);
    };
  }
}
