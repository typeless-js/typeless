import React from 'react';
import { createModule } from '../src/createModule';
import { useMappedState } from '../src/useMappedState';
import { act } from 'react-dom/test-utils';
import { TypelessContext } from '../src/TypelessContext';
import { Registry } from '../src/Registry';
import ReactDOM from 'react-dom';
import { shallowEqualObjects } from 'shallow-equal';

let container: HTMLDivElement = null!;
let registry: Registry = null!;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  registry = new Registry();
});

afterEach(() => {
  document.body.removeChild(container);
  container = null!;
  registry = null;
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

describe('re-render prevention', () => {
  const [useModule, Actions, getState] = createModule(Symbol('sample'))
    .withActions({
      increment1: null,
      increment2: null,
      pushArr: (text: string) => ({ payload: { text } }),
    })
    .withState<{ count1: number; count2: number; arr: string[] }>();

  useModule
    .reducer({ count1: 0, count2: 0, arr: ['initial'] })
    .on(Actions.increment1, state => {
      state.count1++;
    })
    .on(Actions.increment2, state => {
      state.count2++;
    })
    .on(Actions.pushArr, (state, { text }) => {
      state.arr.push(text);
    });
  describe('result is same value by Object.is equality(default)', () => {
    let renderCount: number = null;
    function App() {
      renderCount++;
      useModule();

      // primitive value
      const count1 = useMappedState([getState], s => s.count1);

      // referenced value
      const arr = useMappedState([getState], s => s.arr);
      return (
        <div>
          <div className="count">{count1}</div>
          <div className="arr">{arr.join()}</div>
        </div>
      );
    }

    beforeEach(() => {
      renderCount = 0;
      render(<App />);
    });

    function getActualValues() {
      return {
        count: container.querySelector('.count')?.textContent,
        arr: container.querySelector('.arr')?.textContent,
        renderCount,
      };
    }
    it('should show initialized state', () => {
      expect(getActualValues()).toStrictEqual({
        count: '0',
        arr: 'initial',
        renderCount: 1,
      });
    });
    it('should be re-rendered if primitive value has updated', () => {
      act(() => {
        registry.dispatch(Actions.increment1());
      });
      expect(getActualValues()).toStrictEqual({
        count: '1',
        arr: 'initial',
        renderCount: 2,
      });
    });
    it('should be re-rendered if referenced value has updated', () => {
      act(() => {
        registry.dispatch(Actions.pushArr('add'));
      });
      expect(getActualValues()).toStrictEqual({
        count: '0',
        arr: 'initial,add',
        renderCount: 2,
      });
    });
    it('should prevent re-render if unrelated value has updated', () => {
      act(() => {
        registry.dispatch(Actions.increment2());
      });
      expect(getActualValues()).toStrictEqual({
        count: '0',
        arr: 'initial',
        renderCount: 1,
      });
    });
  });

  describe('result is same value by shallow equality', () => {
    let renderCount: number = null;
    function App() {
      renderCount++;
      useModule();

      // result is new object
      const { count1, arr } = useMappedState(
        [getState],
        ({ count2, ...rest }) => rest,
        shallowEqualObjects
      );
      return (
        <div>
          <div className="count">{count1}</div>
          <div className="arr">{arr.join()}</div>
        </div>
      );
    }

    beforeEach(() => {
      renderCount = 0;
      render(<App />);
    });

    function getActualValues() {
      return {
        count: container.querySelector('.count')?.textContent,
        arr: container.querySelector('.arr')?.textContent,
        renderCount,
      };
    }
    it('should show initialized state', () => {
      expect(getActualValues()).toStrictEqual({
        count: '0',
        arr: 'initial',
        renderCount: 1,
      });
    });
    it('should be re-rendered if `count1` that depends on result has updated', () => {
      act(() => {
        registry.dispatch(Actions.increment1());
      });
      expect(getActualValues()).toStrictEqual({
        count: '1',
        arr: 'initial',
        renderCount: 2,
      });
    });
    it('should be re-rendered if `arr` that depends on result has updated', () => {
      act(() => {
        registry.dispatch(Actions.pushArr('add'));
      });
      expect(getActualValues()).toStrictEqual({
        count: '0',
        arr: 'initial,add',
        renderCount: 2,
      });
    });
    it('should prevent re-render if unrelated value has updated', () => {
      act(() => {
        registry.dispatch(Actions.increment2());
      });
      expect(getActualValues()).toStrictEqual({
        count: '0',
        arr: 'initial',
        renderCount: 1,
      });
    });
  });
});
