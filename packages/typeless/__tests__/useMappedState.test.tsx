import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { createModule } from '../src2/createModule';
import { useMappedState } from '../src2/useMappedState';
import { useActions } from '../src2/useActions';

let container: HTMLDivElement = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('single module', () => {
  const [handle, Actions, getState] = createModule(Symbol('sample'))
    .withActions({
      increase: null,
    })
    .withState<{ count: number }>();

  const useModule = handle.addReducer({ count: 0 }, reducer =>
    reducer.on(Actions.increase, state => {
      state.count++;
    })
  );

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

  act(() => {
    ReactDOM.render(<App />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('0');
  expect(renderCount).toEqual(1);
  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(label.textContent).toBe('1');
  expect(renderCount).toEqual(2);
});

it('two modules', () => {
  const [handleX, XActions, getXState] = createModule(Symbol('moduleX'))
    .withActions({
      increaseX: null,
      reset: null,
    })
    .withState<{ count: number }>();

  const useXModule = handleX.addReducer({ count: 0 }, reducer =>
    reducer
      .on(XActions.increaseX, state => {
        state.count++;
      })
      .on(XActions.reset, state => {
        state.count = 0;
      })
  );

  const [handleY, YActions, getYState] = createModule(Symbol('moduleY'))
    .withActions({
      increaseY: null,
    })
    .withState<{ count: number }>();

  const useYModule = handleY.addReducer({ count: 0 }, reducer =>
    reducer
      .on(YActions.increaseY, state => {
        state.count++;
      })
      .on(XActions.reset, state => {
        state.count = 0;
      })
  );

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
  act(() => {
    ReactDOM.render(<App />, container);
  });
  const incX = container.querySelector('#inc-x');
  const incY = container.querySelector('#inc-y');
  const reset = container.querySelector('#reset');
  const labelX = container.querySelector('#count-x');
  const labelY = container.querySelector('#count-y');
  expect(labelX.textContent).toBe('0');
  expect(labelY.textContent).toBe('0');
  expect(renderCount).toEqual(1);

  // click X
  act(() => {
    incX.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(labelX.textContent).toBe('1');
  expect(labelY.textContent).toBe('0');
  expect(renderCount).toEqual(2);

  // click Y
  act(() => {
    incY.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(labelX.textContent).toBe('1');
  expect(labelY.textContent).toBe('1');
  expect(renderCount).toEqual(3);

  // reset
  act(() => {
    reset.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(labelX.textContent).toBe('0');
  expect(labelY.textContent).toBe('0');
  expect(renderCount).toEqual(4);
});

fit('single module with deps', () => {
  const [handle, Actions, getState] = createModule(Symbol('sample'))
    .withActions({
      increase: (type: 'a' | 'b') => ({ payload: { type } }),
    })
    .withState<{ a: number; b: number }>();

  const useModule = handle.addReducer({ a: 0, b: 1000 }, reducer =>
    reducer.on(Actions.increase, (state, { type }) => {
      console.log('update reducer');
      state[type]++;
    })
  );

  let renderCount = 0;

  function App() {
    renderCount++;
    console.log('render', renderCount);
    const [type, setType] = React.useState('a' as 'a' | 'b');
    useModule();
    const { increase } = useActions(Actions);
    const count = useMappedState([getState], state => state[type], [type]);
    console.log({ type, count });
    return (
      <div>
        <p id="count">{count}</p>
        <button id="inc" onClick={() => increase(type)}>
          increase
        </button>
        <button id="toggle" onClick={() => setType(type === 'a' ? 'b' : 'a')}>
          increase
        </button>
      </div>
    );
  }
  // initial
  act(() => {
    ReactDOM.render(<App />, container);
  });
  const inc = container.querySelector('#inc');
  const toggle = container.querySelector('#toggle');
  const label = container.querySelector('#count');
  expect(label.textContent).toBe('0');
  expect(renderCount).toEqual(1);

  // increase 'a'
  console.log('increase a');
  act(() => {
    inc.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(label.textContent).toBe('1');
  expect(renderCount).toEqual(2);

  // switch to 'b'
  console.log('toggle');
  act(() => {
    toggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(label.textContent).toBe('1000');
  expect(renderCount).toEqual(3);

  // increase 'n'
  act(() => {
    inc.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(label.textContent).toBe('1001');
  expect(renderCount).toEqual(3);
});
