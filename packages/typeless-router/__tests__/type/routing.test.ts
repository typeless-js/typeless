import { TT } from './TypeTester';
import { RouterActions } from '../../src/module';

TT.describe('RouterActions', () => {
  TT.it('should infer ActionCreator function', () => {
    TT.assert<TT.Eq<typeof RouterActions.dispose, () => {}>>();
  });
});
