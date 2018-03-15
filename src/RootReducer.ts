import { withBatch } from './withBatch';
import { DefaultState, Reducer, ActionLike } from './types';

type AnyObject = {
  [x: string]: any;
};

function addAtPath(obj: AnyObject, value: any, path: string[]) {
  const [current, ...rest] = path;
  if (rest.length) {
    if (!obj[current]) {
      obj[current] = {};
    }
    addAtPath(obj[current], value, rest);
  } else {
    obj[current] = value;
  }
}

function removeAtPath(obj: AnyObject, path: string[]) {
  const [current, ...rest] = path;
  if (rest.length) {
    if (!obj[current]) {
      return;
    }
    removeAtPath(obj[current], rest);
  } else {
    delete obj[current];
  }
}

function applyReducerTree(
  state: AnyObject,
  tree: AnyObject,
  action: ActionLike
) {
  let newState = state;
  let isModified = false;
  const updateState = (key: string, newSubState: AnyObject) => {
    if (newState[key] === newSubState) {
      return;
    }
    if (!isModified) {
      isModified = true;
      newState = { ...state };
    }
    newState[key] = newSubState;
  };
  Object.keys(tree).map(key => {
    if (typeof tree[key] === 'function') {
      const subReducer = tree[key];
      updateState(key, subReducer(state[key], action));
    } else {
      const subState = state[key] === undefined ? {} : state[key];
      updateState(key, applyReducerTree(subState, tree[key], action));
    }
  });
  return newState;
}

export class RootReducer<TState = DefaultState> {
  private tree: AnyObject;
  constructor() {
    this.tree = {};
  }

  getReducer() {
    return withBatch((state: TState, action: ActionLike) =>
      applyReducerTree(state, this.tree, action)
    );
  }

  addReducer(reducer: Reducer<any>, path: string[]) {
    addAtPath(this.tree, reducer, path);
  }

  removeReducer(path: string[]) {
    removeAtPath(this.tree, path);
  }
}
