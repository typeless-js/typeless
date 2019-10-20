import React, { createElement } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { createModule } from '../src/createModule';
import { Registry } from '../src/Registry';
import { TypelessContext } from '../src/TypelessContext';

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

  function render(registry: Registry, factory: () => JSX.Element) {
    act(() => {
      ReactDOM.render(
        <TypelessContext.Provider value={{ registry }}>
          {createElement(factory)}
        </TypelessContext.Provider>,
        container
      );
    });
  }

  it('should be initialized', () => {
    const [handle] = createModule(Symbol('foo')).withState<number>();
    handle.reducer(1);

    const registry1 = new Registry();
    render(registry1, () => {
      handle();
      return null;
    });

    const registry2 = new Registry();
    render(registry2, () => {
      handle();
      return null;
    });

    expect(registry1.getState()).toStrictEqual({ foo: 1 });
    expect(registry2.getState()).toStrictEqual({ foo: 1 });
  });
});
