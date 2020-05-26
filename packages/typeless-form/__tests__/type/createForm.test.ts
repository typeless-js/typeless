import { TT } from './TypeTester';
import { createForm } from '../../src/createForm';

TT.describe('createForm', () => {
  TT.describe('Actions', () => {
    const Actions = createForm({
      symbol: Symbol('test'),
    })[1];

    TT.it('should infer ActionCreator function', () => {
      TT.assert<TT.Eq<typeof Actions.submit, () => {}>>();
    });
  });
});
