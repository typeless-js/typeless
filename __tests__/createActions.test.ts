import { createActions } from '../src/createActions';

test('action with no args', () => {
  const { empty } = createActions('ns', {
    empty: () => ({}),
  });
  expect(empty()).toEqual({ type: 'ns/EMPTY' });
  expect(empty.toString()).toEqual('ns/EMPTY');
});

test('action wih no args (null)', () => {
  const { empty } = createActions('ns', {
    empty: null,
  });
  expect(empty()).toEqual({ type: 'ns/EMPTY' });
  expect(empty.toString()).toEqual('ns/EMPTY');
});

test('action with 1 arg', () => {
  const { oneArg } = createActions('ns', {
    empty: null,
    oneArg: (a: number) => ({ payload: { a } }),
  });
  expect(oneArg(1)).toEqual({ type: 'ns/ONE_ARG', payload: { a: 1 } });
  expect(oneArg.toString()).toEqual('ns/ONE_ARG');
});

test('action with 2 args', () => {
  const { twoArgs } = createActions('ns', {
    twoArgs: (a: number, b: string) => ({ payload: { a, b } }),
  });
  expect(twoArgs(1, 'foo')).toEqual({
    type: 'ns/TWO_ARGS',
    payload: { a: 1, b: 'foo' },
  });
  expect(twoArgs.toString()).toEqual('ns/TWO_ARGS');
});
