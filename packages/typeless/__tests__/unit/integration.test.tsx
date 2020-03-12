import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { createModule } from '../../src/createModule';
import { createSelector } from '../../src/createSelector';
import { defaultRegistry } from '../../src/TypelessContext';
import { useActions } from '../../src/useActions';
import { useMappedState } from '../../src/useMappedState';
import { useSelector } from '../../src/useSelector';
import { renderWithProvider } from './helpers';

let container: HTMLDivElement = null!;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null!;
});

function clickButton(element: Element) {
  act(() => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
}

it('single module', () => {
  const [useModule, Actions, getState] = createModule(Symbol('sample'))
    .withActions({
      increase: null,
    })
    .withState<{ count: number }>();

  useModule.reducer({ count: 0 }).on(Actions.increase, state => {
    state.count++;
  });

  let renderCount = 0;

  function App() {
    renderCount++;
    useModule();
    const { increase } = useActions(Actions);
    const count = useMappedState([getState], state => state.count);
    return (
      <div>
        <p>{count}</p>
        <button onClick={increase}>increase</button>
      </div>
    );
  }

  // initial render
  renderWithProvider(<App />, container, defaultRegistry);

  const button = container.querySelector('button')!;
  const label = container.querySelector('p')!;
  expect(label.textContent).toBe('0');
  expect(renderCount).toEqual(1);

  // click button
  clickButton(button);
  expect(label.textContent).toBe('1');
  expect(renderCount).toEqual(2);
});

it('two modules', () => {
  const [useXModule, XActions, getXState] = createModule(Symbol('moduleX'))
    .withActions({
      increaseX: null,
      reset: null,
    })
    .withState<{ count: number }>();

  useXModule
    .reducer({ count: 0 })
    .on(XActions.increaseX, state => {
      state.count++;
    })
    .on(XActions.reset, state => {
      state.count = 0;
    });

  const [useYModule, YActions, getYState] = createModule(Symbol('moduleY'))
    .withActions({
      increaseY: null,
    })
    .withState<{ count: number }>();

  useYModule
    .reducer({ count: 0 })
    .on(YActions.increaseY, state => {
      state.count++;
    })
    .on(XActions.reset, state => {
      state.count = 0;
    });

  let renderCount = 0;

  function App() {
    renderCount++;
    useXModule();
    useYModule();
    const { increaseX, reset } = useActions(XActions);
    const { increaseY } = useActions(YActions);
    const { countX, countY } = useMappedState(
      [getXState, getYState],
      (xState, yState) => ({
        countX: xState.count,
        countY: yState.count,
      })
    );
    return (
      <div>
        <p id="count-x">{countX}</p>
        <p id="count-y">{countY}</p>
        <button id="inc-x" onClick={increaseX}>
          increase x
        </button>
        <button id="inc-y" onClick={increaseY}>
          increase y
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
    );
  }

  // initial render
  renderWithProvider(<App />, container, defaultRegistry);

  const incX = container.querySelector('#inc-x')!;
  const incY = container.querySelector('#inc-y')!;
  const resetBtn = container.querySelector('#reset')!;
  const labelX = container.querySelector('#count-x')!;
  const labelY = container.querySelector('#count-y')!;
  expect(labelX.textContent).toBe('0');
  expect(labelY.textContent).toBe('0');
  expect(renderCount).toEqual(1);

  // click X
  clickButton(incX);
  expect(labelX.textContent).toBe('1');
  expect(labelY.textContent).toBe('0');
  expect(renderCount).toEqual(2);

  // click Y
  clickButton(incY);
  expect(labelX.textContent).toBe('1');
  expect(labelY.textContent).toBe('1');
  expect(renderCount).toEqual(3);

  // reset
  clickButton(resetBtn);
  expect(labelX.textContent).toBe('0');
  expect(labelY.textContent).toBe('0');
  expect(renderCount).toEqual(4);
});

it('single module with epic', () => {
  const [useModule, Actions, getState] = createModule(Symbol('sample'))
    .withActions({
      increase: null,
      set: (count: number) => ({ payload: { count } }),
    })
    .withState<{ count: number }>();

  useModule.epic().on(Actions.increase, () => {
    return Actions.set(getState().count * 2);
  });

  useModule
    .reducer({ count: 0 })
    .on(Actions.increase, state => {
      state.count++;
    })
    .on(Actions.set, (state, { count }) => {
      state.count = count;
    });

  let renderCount = 0;
  const values: any[] = [];
  function App() {
    renderCount++;
    useModule();
    const { increase } = useActions(Actions);
    const count = useMappedState([getState], state => state.count);
    values.push({ count });
    return (
      <div>
        <p>{count}</p>
        <button onClick={increase}>increase</button>
      </div>
    );
  }

  // initial render
  renderWithProvider(<App />, container, defaultRegistry);

  const button = container.querySelector('button')!;
  const label = container.querySelector('p')!;
  expect(label.textContent).toBe('0');
  expect(renderCount).toEqual(1);

  clickButton(button);
  clickButton(button);
  // 0
  // (0 + 1) * 2 = 2
  // (2 + 1) * 2 = 6
  expect(values).toEqual([{ count: 0 }, { count: 2 }, { count: 6 }]);
});

it('single module with selectors', () => {
  const [useModule, Actions, getState] = createModule(Symbol('sample'))
    .withActions({
      increase: null,
    })
    .withState<{ count: number }>();

  useModule.reducer({ count: 0 }).on(Actions.increase, state => {
    state.count++;
  });

  const selector1 = createSelector(
    [getState, state => state.count],
    count => count + 1
  );
  const selector2 = createSelector(selector1, count => count + 1);
  const values: any[] = [];

  function App() {
    useModule();
    const { increase } = useActions(Actions);
    const org = useMappedState([getState], state => state.count);
    const s1 = useSelector(selector1);
    const s2 = useSelector(selector2);
    values.push({ org, s1, s2 });
    return (
      <div>
        <button onClick={increase}>increase</button>
      </div>
    );
  }

  // initial render
  renderWithProvider(<App />, container, defaultRegistry);

  const button = container.querySelector('button')!;

  // click button x 2
  clickButton(button);
  clickButton(button);
  expect(values).toEqual([
    { org: 0, s1: 1, s2: 2 },
    { org: 1, s1: 2, s2: 3 },
    { org: 2, s1: 3, s2: 4 },
  ]);
});

it('modify state in $mounted should cause re-render', () => {
  // bug from typeless 1.0.0
  const [useModule, Actions, getState] = createModule(Symbol('sample'))
    .withActions({
      $mounted: null,
    })
    .withState<{ count: number }>();

  useModule.reducer({ count: 0 }).on(Actions.$mounted, state => {
    state.count = 1;
  });

  let renderCount = 0;

  function App() {
    renderCount++;
    useModule();
    const count = useMappedState([getState], state => state.count);
    return (
      <div>
        <p>{count}</p>
      </div>
    );
  }

  // initial render
  renderWithProvider(<App />, container, defaultRegistry);

  const label = container.querySelector('p')!;
  expect(label.textContent).toBe('1');
  expect(renderCount).toEqual(2);
});
