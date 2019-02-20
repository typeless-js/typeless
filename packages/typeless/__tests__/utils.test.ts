import { snakeCase } from '../src/utils';

describe('snakeCase', () => {
  it('foo', () => {
    expect(snakeCase('foo')).toEqual('foo');
  });
  it('fooBar', () => {
    expect(snakeCase('fooBar')).toEqual('foo_bar');
  });
  it('foo-bar', () => {
    expect(snakeCase('foo-bar')).toEqual('foo_bar');
  });
  it('foo_bar', () => {
    expect(snakeCase('foo_bar')).toEqual('foo_bar');
  });
});
