import { TT } from './TypeTester';
import { RouterActions } from '../../src/module';
import { Action } from 'typeless';

TT.describe('RouterActions', () => {
  TT.it('should infer ActionCreator function', () => {
    TT.assert<TT.Eq<typeof RouterActions.dispose, () => Action<never>>>();
  });
});
