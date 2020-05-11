import { Registry } from '../../src/Registry';
import { ChainedReducer } from '../../src/ChainedReducer';

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

describe('getState', () => {
  it("sholud return all of store's state", () => {
    const expected = {
      module: { foo: 'fooState' },
      'module#2': { baz: 'bazState' },
    };
    const store = registry.getStore(Symbol('module'));
    store.enable({
      epic: null,
      reducer: new ChainedReducer(expected.module).asReducer(),
    });
    store.initState();
    const store2 = registry.getStore(Symbol('module'));
    store2.enable({
      epic: null,
      reducer: new ChainedReducer(expected['module#2']).asReducer(),
    });
    store2.initState();
    expect(registry.getState()).toStrictEqual(expected);
  });
});
