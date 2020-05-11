import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { createModule } from '../../src/createModule';
import { Registry } from '../../src/Registry';
import { renderWithProvider } from './helpers';

let container: HTMLDivElement = null!;
let registry: Registry;
let dispatch: jest.SpyInstance = null!;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  registry = new Registry();
  dispatch = jest.spyOn(registry, 'dispatch');
});

afterEach(() => {
  document.body.removeChild(container);
  container = null!;
});

test('epic should be in correct sync order', () => {
  // keep consistency with redux-observable
  // https://github.com/redux-observable/redux-observable/commit/d3516bf

  const [useModule, Actions] = createModule(Symbol('sample')).withActions({
    a: null,
    b: null,
    c: null,
    d: null,
  });

  useModule
    .epic()
    .on(Actions.a, () => [Actions.b(), Actions.c()])
    .on(Actions.b, () => Actions.d());

  function App(): ReturnType<React.FC> {
    useModule();
    return null;
  }
  renderWithProvider(<App />, container, registry);
  act(() => {
    registry.dispatch(Actions.a());
  });

  expect(dispatch.mock.calls.map(call => call[0].type[1])).toEqual([
    'A',
    'B',
    'C',
    'D',
  ]);
});
