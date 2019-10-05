import { Reducer, ActionLike } from './types';
import { Epic } from './Epic';
import { Notify } from './Notify';

type Listener = () => void;

export class Store<TState = any> {
  public isEnabled: boolean = false;
  public state: TState | undefined = undefined;
  public reducer: Reducer<TState> | null = null;
  public epic: Epic | null = null;
  private listeners: Listener[] = [];
  private usageCount: number = 0;

  constructor(public name: symbol, public displayName: string) {}

  initState() {
    if (this.reducer) {
      this.state = this.reducer(undefined, {
        type: [Symbol('__INIT__'), 'init'],
      });
    }
  }

  enable({ epic, reducer }: { epic: Epic | null; reducer: Reducer<TState> | null }) {
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

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners.splice(this.listeners.indexOf(listener), 1);
    };
  }
}
