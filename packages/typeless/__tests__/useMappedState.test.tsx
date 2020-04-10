import React from 'react';
import { createModule } from '../src/createModule';
import { useMappedState } from '../src/useMappedState';
import { act } from 'react-dom/test-utils';
import { TypelessContext } from '../src/TypelessContext';
import { Registry } from '../src/Registry';
import ReactDOM from 'react-dom';

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

function render(node: React.ReactChild, registry: Registry) {
  act(() => {
    ReactDOM.render(
      <TypelessContext.Provider value={{ registry }}>
        {node}
      </TypelessContext.Provider>,
      container
    );
  });
}

it('modify state should prevent re-render', () => {
  const [useModule, Actions, getState] = createModule(Symbol('sample'))
    .withActions({
      increment1: null,
      increment2: null,
    })
    .withState<{ count1: number; count2: number }>();

  useModule
    .reducer({ count1: 0, count2: 0 })
    .on(Actions.increment1, state => {
      state.count1++;
    })
    .on(Actions.increment2, state => {
      state.count2++;
    });

  let renderCount = 0;

  function App() {
    React.useEffect(() => {
      renderCount++;
    });
    useModule();
    const count = useMappedState([getState], state => state.count1);
    return <p>{count}</p>;
  }

  // initial render
  render(<App />, registry);

  let label = container.querySelector('p')!;
  expect(label.textContent).toBe('0');
  expect(renderCount).toEqual(1);

  act(() => {
    registry.dispatch(Actions.increment2());
  });
  expect(renderCount).toEqual(1);
  label = container.querySelector('p')!;
  expect(label.textContent).toBe('0');
});
