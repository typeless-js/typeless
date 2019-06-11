import { createModule } from '../src/createModule';

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
