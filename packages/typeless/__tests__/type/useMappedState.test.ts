import { createModule } from '../../src/createModule';
import { useMappedState } from '../../src/useMappedState';
import { TT } from './TypeTester';

TT.describe('useMappedState', () => {
  function createTestModule<T>() {
    return createModule(Symbol('test')).withState<T>()[1];
  }

  const getCountState = createTestModule<{ count: number }>();
  const getTextState = createTestModule<{ text: string }>();

  TT.it("should infer callback's arguments type", () => {
    useMappedState([getCountState, getTextState], (c, t) => {
      TT.assert<TT.Eq<typeof c, { count: number }>>();
      TT.assert<TT.Eq<typeof t, { text: string }>>();
    });
  });
  TT.it('should infer return type', () => {
    const mapped = useMappedState([getCountState, getTextState], (c, t) => {
      return { ...c, ...t };
    });
    TT.assert<TT.Eq<typeof mapped, { count: number; text: string }>>();
  });

  TT.describe('many args', () => {
    const m1 = createTestModule<{ [1]: number }>();
    const m2 = createTestModule<{ [2]: string }>();
    const m3 = createTestModule<{ [3]: boolean }>();
    const m4 = createTestModule<{ [4]: symbol }>();
    const m5 = createTestModule<{ [5]: 'literal' }>();
    const m6 = createTestModule<{ [6]: null }>();

    TT.it("should infer callback's arguments", () => {
      useMappedState([m1, m2, m3, m4, m5, m6], (...args) => {
        type Expected = [
          { 1: number },
          { 2: string },
          { 3: boolean },
          { 4: symbol },
          { 5: 'literal' },
          { 6: null }
        ];
        TT.assert<TT.Eq<typeof args, Expected>>();
      });
    });
  });
});
