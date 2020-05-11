import { createModule } from '../../src/createModule';
import { TT } from './TypeTester';

TT.test('Actions should infer ActionCreator function', () => {
  const Actions = createModule(Symbol('test')).withActions({
    noPayload: null,
    withPayload: () => ({ payload: { x: 'string' } }),
  })[1];

  TT.assert<TT.Eq<typeof Actions.noPayload, () => {}>>();
  TT.assert<
    TT.Eq<typeof Actions.withPayload, () => { payload: { x: string } }>
  >();
});
