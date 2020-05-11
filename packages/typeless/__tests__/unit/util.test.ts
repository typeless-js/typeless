import { objectIs } from '../../src/utils';

describe('objectIs', () => {
  // ref. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is

  const obj = { x: 1 };
  const truthyCases = [
    { description: 'same string', a: 'foo', b: 'foo' },
    { description: 'same BigInt', a: BigInt(1), b: BigInt(1) },
    { description: 'same referenced object', a: obj, b: obj },
    { description: 'both null', a: null, b: null },
    { description: 'both NaN', a: NaN, b: NaN },
    { description: 'both minus zero value', a: -0, b: -0 },
  ];
  truthyCases.forEach(({ description, a, b }) => {
    it(`should return true called with ${description}`, () => {
      expect(objectIs(a, b)).toBeTruthy();
    });
  });

  const falsyCases = [
    { description: 'different reference object', a: [42], b: [42] },
    { description: 'different number', a: 0, b: 1 },
    { description: 'zero and plus zero value', a: 0, b: -0 },
  ];
  falsyCases.forEach(({ description, a, b }) => {
    it(`should return false called with ${description}`, () => {
      expect(objectIs(a, b)).toBeFalsy();
    });
  });
});
