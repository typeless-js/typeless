import { createModule } from '../../src/createModule';
import { TT } from './TypeTester';
import { Action } from '../../src/types';

TT.test('Actions should infer ActionCreator function', () => {
  const Actions = createModule(Symbol('test')).withActions({
    noPayload: null as null,
    withPayload: () => ({ payload: { x: 'string' } }),
  })[1];

  TT.assert<TT.Eq<typeof Actions.noPayload, () => Action<never>>>();
  TT.assert<TT.Eq<typeof Actions.withPayload, () => Action<{ x: string }>>>();
});
