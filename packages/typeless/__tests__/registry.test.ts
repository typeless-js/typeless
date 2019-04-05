import { Registry } from '../src/Registry';

let registry: Registry;

beforeEach(() => {
  registry = new Registry();
});

describe('getDisplayName', () => {
  it('should return without hash', () => {
    const name = Symbol('module');
    expect(registry.getDisplayName(name)).toEqual('module');
    expect(registry.getDisplayName(name)).toEqual('module');
  });
  it('should return with hash', () => {
    expect(registry.getDisplayName(Symbol('module'))).toEqual('module');
    expect(registry.getDisplayName(Symbol('module'))).toEqual('module#2');
  });
});

describe('getActionSymbol', () => {
  it('should action symbol', () => {
    const name = Symbol('module');
    expect(registry.getActionSymbol(name, 'foo').toString()).toEqual(
      'Symbol(module/FOO)'
    );
  });
});
