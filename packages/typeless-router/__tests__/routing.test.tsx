import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { TypelessContext, Registry } from 'typeless';
import { createUseRouter, RouterActions, getRouterState } from '../src/module';

let container: HTMLDivElement = null;
let registry: Registry;
let dispatch: jest.SpyInstance = null;
let pushState: jest.SpyInstance = null;
let replaceState: jest.SpyInstance = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  registry = new Registry();
  dispatch = jest.spyOn(registry, 'dispatch');
  pushState = jest.spyOn(history, 'pushState');
  replaceState = jest.spyOn(history, 'replaceState');
});

function render(node: React.ReactChild) {
  act(() => {
    ReactDOM.render(
      <TypelessContext.Provider value={{ registry }}>
        {node}
      </TypelessContext.Provider>,
      container
    );
  });
}

function assertUrl(url: string) {
  expect(pushState).toBeCalledWith(null, '', url);
  pushState.mockClear();
}

afterEach(() => {
  jest.clearAllMocks();
  // registry.dispatch(RouterActions.$unmounted());
});

describe('browser', () => {
  function init() {
    const useRouter = createUseRouter({
      type: 'browser',
    });
    function App() {
      useRouter();
      return null;
    }
    render(<App />);
  }

  it('routing', () => {
    init();

    // initial
    expect(getRouterState()).toEqual({
      location: { pathname: '/', search: '', type: 'push' },
      prevLocation: null,
    });
    expect(dispatch).toBeCalledWith(
      RouterActions.locationChange({
        pathname: '/',
        search: '',
        type: 'push',
      })
    );

    // go to /foo
    registry.dispatch(RouterActions.push('/foo'));
    expect(getRouterState()).toEqual({
      location: { pathname: '/foo', search: '', type: 'push' },
      prevLocation: { pathname: '/', search: '', type: 'push' },
    });
    assertUrl('/foo');

    // go to '/bar?a=1&b=2
    registry.dispatch(
      RouterActions.push({
        pathname: '/bar',
        search: 'a=1&b=2',
      })
    );
    expect(getRouterState()).toEqual({
      location: { pathname: '/bar', search: 'a=1&b=2', type: 'push' },
      prevLocation: { pathname: '/foo', search: '', type: 'push' },
    });
    assertUrl('/bar?a=1&b=2');

    // bo back
    // mock of history.back();
    delete window.location;
    window.location = { pathname: '/foo', search: '' } as any;
    dispatchEvent(new PopStateEvent('popstate'));

    expect(getRouterState()).toEqual({
      location: { pathname: '/foo', search: '', type: 'push' },
      prevLocation: { pathname: '/bar', search: 'a=1&b=2', type: 'push' },
    });
  });

  it('with custom initial location', () => {
    delete window.location;
    window.location = { pathname: '/my-path', search: '?foo=1' } as any;
    init();
    expect(dispatch).toBeCalledWith(
      RouterActions.locationChange({
        pathname: '/my-path',
        search: '?foo=1',
        type: 'push',
      })
    );
  });
});

describe('hash', () => {
  function init() {
    const useRouter = createUseRouter({
      type: 'hash',
    });
    function App() {
      useRouter();
      return null;
    }
    render(<App />);
  }

  it('routing', () => {
    delete window.location;
    window.location = { pathname: '/', search: '', hash: '#/' } as any;
    init();

    // initial
    expect(getRouterState()).toEqual({
      location: { pathname: '/', search: '', type: 'push' },
      prevLocation: null,
    });
    expect(dispatch).toBeCalledWith(
      RouterActions.locationChange({
        pathname: '/',
        search: '',
        type: 'push',
      })
    );

    // go to /foo
    registry.dispatch(RouterActions.push('/foo'));
    expect(getRouterState()).toEqual({
      location: { pathname: '/foo', search: '', type: 'push' },
      prevLocation: { pathname: '/', search: '', type: 'push' },
    });
    assertUrl('/#/foo');

    // go to '/bar?a=1&b=2
    registry.dispatch(
      RouterActions.push({
        pathname: '/bar',
        search: 'a=1&b=2',
      })
    );
    expect(getRouterState()).toEqual({
      location: { pathname: '/bar', search: 'a=1&b=2', type: 'push' },
      prevLocation: { pathname: '/foo', search: '', type: 'push' },
    });
    assertUrl('/#/bar?a=1&b=2');

    // bo back
    // mock of history.back();
    delete window.location;
    window.location = { pathname: '/', search: '', hash: '#/foo' } as any;
    dispatchEvent(new PopStateEvent('popstate'));

    expect(getRouterState()).toEqual({
      location: { pathname: '/foo', search: '', type: 'push' },
      prevLocation: { pathname: '/bar', search: 'a=1&b=2', type: 'push' },
    });
  });

  it('with custom initial location', () => {
    delete window.location;
    window.location = {
      pathname: '/',
      search: '',
      hash: '#/my-path?foo=1',
    } as any;
    init();
    expect(dispatch).toBeCalledWith(
      RouterActions.locationChange({
        pathname: '/my-path',
        search: '?foo=1',
        type: 'push',
      })
    );
  });
});
