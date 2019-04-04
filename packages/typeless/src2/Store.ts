import { Reducer, ActionLike } from './types';
import { Epic } from './Epic';
import { Notify } from './Notify';

type Listener = () => void;

export class Store<TState = any> {
  public isEnabled: boolean = false;
  public state: TState | undefined = undefined;
  public reducer: Reducer<TState> = null;
  public epic: Epic = null;
  private listeners: Listener[] = [];

  initState() {
    if (this.reducer) {
      this.state = this.reducer(undefined, { type: Symbol('__INIT__') });
    }
  }

  enable({ epic, reducer }: { epic?: Epic; reducer?: Reducer<TState> }) {
    this.epic = epic || null;
    this.reducer = reducer || null;
    this.isEnabled = true;
  }

  disable() {
    this.epic = null;
    this.reducer = null;
    this.isEnabled = false;
  }

  dispatch(action: ActionLike, notify?: Notify) {
    if (!this.isEnabled) {
      return;
    }
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

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners.splice(this.listeners.indexOf(listener), 1);
    };
  }
}
