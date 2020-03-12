import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { of } from 'rxjs';
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

test('epic should ignore action when returned null value', () => {
  const [useModule, Actions] = createModule(Symbol('sample')).withActions({
    a: null,
  });

  useModule
    .epic()
    .on(Actions.a, () => null)
    .on(Actions.a, () => Promise.resolve(null))
    .on(Actions.a, () => of(null));

  function App(): ReturnType<React.FC> {
    useModule();
    return null;
  }
  renderWithProvider(<App />, container, registry);
  act(() => {
    registry.dispatch(Actions.a());
  });

  expect(dispatch.mock.calls.map(call => call[0].type[1])).toEqual(['A']);
});
