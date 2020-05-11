import React from 'react';
import { act } from 'react-dom/test-utils';
import { createModule } from '../src/createModule';
import { createSelector } from '../src/createSelector';
import { Registry } from '../src/Registry';
import { useSelector } from '../src/useSelector';
import { renderWithProvider } from './helpers';

let container: HTMLDivElement = null!;
let registry: Registry = null!;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  registry = new Registry();
});

afterEach(() => {
  document.body.removeChild(container);
  container = null!;
  registry = null;
});

const [useModule, Actions, getState] = createModule(Symbol('sample'))
  .withActions({ increment: null })
  .withState<{ count: number }>();

useModule.reducer({ count: 0 }).on(Actions.increment, state => {
  state.count += 1;
});
const selector = createSelector(
  [getState, state => state.count],
  count => count + 1
);
describe('useSelector', () => {
  let renderCount: number = null!;
  beforeEach(() => {
    renderCount = 0;
    renderWithProvider(<App />, container, registry);
  });
  function App() {
    renderCount++;
    useModule();

    // `() => true` prevent re-render always
    const count = useSelector(selector, () => true);
    return <div>{count}</div>;
  }
  it('should prevent re-render with equalityFn', () => {
    act(() => {
      registry.dispatch(Actions.increment());
    });
    expect(renderCount).toBe(1);
  });
});
