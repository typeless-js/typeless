import { createModule, ActionMap } from '../../src/createModule';
import { Epic } from '../../src/Epic';
import { TT } from './TypeTester';

function createAction<T extends ActionMap>(acts: T) {
  return createModule(Symbol('test')).withActions(acts)[1];
}
TT.describe('onMany', () => {
  const m1 = createAction({ foo: () => ({ payload: 1 }) });
  const m2 = createAction({ foo: () => ({ payload: true }) });
  const m3 = createAction({ foo: () => ({ payload: 'bar' }) });
  const m4 = createAction({ foo: () => ({ payload: Symbol('baz') }) });
  const m5 = createAction({ foo: () => ({ payload: { obj: 'foo' } }) });
  const m6 = createAction({ foo: () => ({ payload: ['array'] }) });

  TT.describe('should error called with', () => {
    TT.it('empty array', () => {
      // @ts-expect-error
      new Epic().onMany([], () => null);
    });
    TT.it('has 1 item array', () => {
      // @ts-expect-error
      new Epic().onMany([m1.foo], () => null);
    });
  });
  TT.describe("should infer callback's arguments", () => {
    TT.it('called with many arguments', () => {
      new Epic().onMany([m1.foo, m2.foo, m3.foo, m4.foo, m5.foo, m6.foo], p => {
        type Expected =
          | number
          | boolean
          | string
          | symbol
          | { obj: string }
          | string[];
        TT.assert<TT.Eq<typeof p, Expected>>();

        return null;
      });
    });
  });
});
