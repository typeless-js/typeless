import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { VirtualTimeScheduler, of, asyncScheduler } from 'rxjs';
import { createModule } from '../src/createModule';
import { useActions } from '../src/useActions';
import { DefaultTypelessProvider } from '../src/TypelessContext';
import { delay } from 'rxjs/operators';

let container: HTMLDivElement = null!;
let scheduler: VirtualTimeScheduler;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  scheduler = new VirtualTimeScheduler();
  asyncScheduler.now = scheduler.now.bind(scheduler);
  asyncScheduler.schedule = scheduler.schedule.bind(scheduler);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null!;
});

function render(node: React.ReactChild) {
  act(() => {
    ReactDOM.render(
      <DefaultTypelessProvider>{node}</DefaultTypelessProvider>,
      container
    );
  });
}

function clickButton(element: Element) {
  act(() => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
}

test('epic with delay', () => {
  const [useModule, Actions, getState] = createModule(Symbol('sample'))
    .withActions({
      ping: null,
      pong: null,
    })
    .withState<{ isPinging: boolean; count: number }>();

  useModule.epic().on(Actions.ping, () => of(Actions.pong()).pipe(delay(500)));
  useModule
    .reducer({ isPinging: false, count: 0 })
    .on(Actions.ping, state => {
      state.isPinging = true;
    })
    .on(Actions.pong, state => {
      state.isPinging = false;
      state.count++;
    });

  let values: any[] = [];

  function App() {
    useModule();
    const { ping } = useActions(Actions);
    values.push(getState.useState());
    return (
      <div>
        <button onClick={ping}>increase</button>
      </div>
    );
  }

  // initial render
  render(<App />);

  const button = container.querySelector('button')!;

  clickButton(button);

  expect(values).toEqual([
    // initial
    { count: 0, isPinging: false },
    // ping()
    { count: 0, isPinging: true },
  ]);
  values = [];
  act(() => {
    scheduler.flush();
  });

  expect(values).toEqual([
    // ping()
    { count: 1, isPinging: false },
  ]);
});
