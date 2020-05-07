import React from 'react';
import { createModule } from '../src/createModule';
import { Registry } from '../src/Registry';
import { renderWithProvider } from './helpers';

test('createModule with actions', () => {
  const [, Actions] = createModule(Symbol('foo')).withActions({
    action1: null,
    action2: (n: number) => ({ payload: { n } }),
  });

  expect(Actions.action1()).toMatchInlineSnapshot(`
    Object {
      "type": Array [
        Symbol(foo),
        "ACTION1",
      ],
    }
  `);
  expect(Actions.action2(1)).toMatchInlineSnapshot(`
    Object {
      "payload": Object {
        "n": 1,
      },
      "type": Array [
        Symbol(foo),
        "ACTION2",
      ],
    }
  `);
});

test('createModule with state', () => {
  const [, getState] = createModule(Symbol('foo')).withState<any>();

  expect(getState()).toBe(undefined);
});

test('createModule with actions and state', () => {
  const [, Actions, getState] = createModule(Symbol('foo'))
    .withActions({
      action1: null,
    })
    .withState<any>();

  expect(Actions.action1()).toMatchInlineSnapshot(`
    Object {
      "type": Array [
        Symbol(foo),
        "ACTION1",
      ],
    }
  `);
  expect(getState()).toBe(undefined);
});

describe('use module at multiple registries', () => {
  let container: HTMLDivElement = null!;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null!;
  });

  it('should be initialized', () => {
    const [handle] = createModule(Symbol('foo')).withState<number>();
    handle.reducer(1);
    function App1(): JSX.Element {
      handle();
      return null;
    }
    const registry1 = new Registry();
    renderWithProvider(<App1 />, container, registry1);

    function App2(): JSX.Element {
      handle();
      return null;
    }
    const registry2 = new Registry();
    renderWithProvider(<App2 />, container, registry2);

    expect(registry1.getState()).toStrictEqual({ foo: 1 });
    expect(registry2.getState()).toStrictEqual({ foo: 1 });
  });
});
