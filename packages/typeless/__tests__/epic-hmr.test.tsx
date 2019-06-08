import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { createModule } from '../src/createModule';
import * as Rx from '../src/rx/rx';
import { TypelessContext } from '../src/TypelessContext';
import { Registry } from '../src/Registry';
import { startHmr, stopHmr } from '../src/onHmr';

let container: HTMLDivElement = null!;
let ModuleSymbol: symbol = null!;
let registry: Registry = null!;
let nextId = 1;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  ModuleSymbol = Symbol('module');
  registry = new Registry();
  nextId = 1;
});

afterEach(() => {
  document.body.removeChild(container);
  container = null!;
});

function render(node: React.ReactChild) {
  act(() => {
    ReactDOM.render(
      <TypelessContext.Provider value={{ registry }}>
        {node}
      </TypelessContext.Provider>,
      container
    );
  });
}

function getModule() {
  const [useModule, Actions, getState] = createModule(ModuleSymbol).withActions(
    {
      ping: null,
      pong: (n: number) => ({ payload: { n } }),
      $remounted: null,
      $mounted: null,
      $unmounted: null,
    }
  );

  return [useModule, Actions, getState] as [
    typeof useModule,
    typeof Actions,
    typeof getState
  ];
}

it('ignore HMR reloads', () => {
  const dispatch = jest.spyOn(registry, 'dispatch');

  const renderWithReload = () => {
    const [useModule, Actions] = getModule();

    // epic should only mount once, and should persist between HMR reloads
    useModule.epic().on(Actions.$mounted, (_, { action$ }) => {
      const id = nextId++;
      return new Rx.Observable(subscriber => {
        return action$.pipe(Rx.ofType(Actions.ping)).subscribe({
          next: () => {
            subscriber.next(Actions.pong(id));
          },
        });
      });
    });

    function App() {
      useModule();
      return <div />;
    }

    // initial render
    render(<App />);

    act(() => {
      registry.dispatch(Actions.ping());
    });

    return Actions;
  };

  const ModuleActions = renderWithReload();

  expect(dispatch.mock.calls).toEqual([
    [ModuleActions.$mounted()],
    [ModuleActions.ping()],
    [ModuleActions.pong(1)],
  ]);

  dispatch.mockClear();

  startHmr();
  renderWithReload();
  stopHmr();

  expect(dispatch.mock.calls).toEqual([
    [ModuleActions.$unmounted()],
    [ModuleActions.$remounted()],
    [ModuleActions.ping()],
    [ModuleActions.pong(1)],
  ]);
});

it('reload epic on HMR', () => {
  const dispatch = jest.spyOn(registry, 'dispatch');

  const renderWithReload = () => {
    const [useModule, Actions] = getModule();

    useModule
      .epic()
      .onMany([Actions.$mounted, Actions.$remounted], (_, { action$ }) => {
        const id = nextId++;
        return new Rx.Observable(subscriber => {
          return action$.pipe(Rx.ofType(Actions.ping)).subscribe({
            next: () => {
              subscriber.next(Actions.pong(id));
            },
          });
        }).pipe(
          Rx.takeUntil(
            Rx.defer(() => {
              return action$.pipe(
                Rx.ofType([Actions.$unmounted, Actions.$remounted])
              );
            })
          )
        );
      });

    function App() {
      useModule();
      return <div />;
    }

    // initial render
    render(<App />);

    act(() => {
      registry.dispatch(Actions.ping());
    });

    return Actions;
  };
  const ModuleActions = renderWithReload();

  expect(dispatch.mock.calls).toEqual([
    [ModuleActions.$mounted()],
    [ModuleActions.ping()],
    [ModuleActions.pong(1)],
  ]);

  dispatch.mockClear();

  startHmr();
  renderWithReload();
  stopHmr();

  expect(dispatch.mock.calls).toEqual([
    [ModuleActions.$unmounted()],
    [ModuleActions.$remounted()],
    [ModuleActions.ping()],
    [ModuleActions.pong(2)],
  ]);
});
