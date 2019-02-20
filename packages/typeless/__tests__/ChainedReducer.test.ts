import { nothing } from 'immer';
import { createReducer } from '../src/createReducer';
import { createActions } from '../src/createActions';

const getInitialState = () => ({
  str: 'foo',
  n: 10,
  arr: [1, 2, 3],
  inner: {
    prop: 'str',
  },
});

const { textAction, textAction2, textAction3, strAction } = createActions(
  'ns',
  {
    textAction: (text: string) => ({ payload: { text } }),
    textAction2: (text: string) => ({ payload: { text } }),
    textAction3: (text: string) => ({ payload: { text } }),
    strAction: (str: string) => ({ payload: { str } }),
  }
);

it('no actions', () => {
  const reducer = createReducer(getInitialState());
  const state = reducer(undefined, { type: 'some-action' });
  expect(state).toEqual(getInitialState());
});

describe('on', () => {
  function getReducer() {
    return createReducer(getInitialState()).on(
      textAction,
      (state, { text }, action) => {
        state.str = text;
        state.n = 1456;
      }
    );
  }
  it('should set values', () => {
    const reducer = getReducer();
    const ret = reducer(undefined, textAction('text'));
    expect(ret).toEqual({
      ...getInitialState(),
      str: 'text',
      n: 1456,
    });
  });
  it('should ignore action', () => {
    const reducer = getReducer();
    const ret = reducer(undefined, textAction2('text'));
    expect(ret).toEqual({
      ...getInitialState(),
    });
  });
});

describe('onMany', () => {
  function getReducer() {
    return createReducer(getInitialState()).onMany(
      [textAction, textAction2],
      (state, { text }, action) => {
        state.str = text;
        state.n = 1456;
      }
    );
  }
  it('should set values', () => {
    const reducer = getReducer();
    const ret = reducer(undefined, textAction2('text'));
    expect(ret).toEqual({
      ...getInitialState(),
      str: 'text',
      n: 1456,
    });
  });
  it('should ignore action', () => {
    const reducer = getReducer();
    const ret = reducer(undefined, textAction3('text'));
    expect(ret).toEqual({
      ...getInitialState(),
    });
  });
});

describe('replace', () => {
  it('should set values', () => {
    const reducer = createReducer(getInitialState()).replace(
      textAction,
      (_, { text }, action) => {
        return {
          ...getInitialState(),
          str: text,
          n: 1456,
        };
      }
    );
    const state = reducer(undefined, textAction('text'));
    expect(state).toEqual({
      ...getInitialState(),
      str: 'text',
      n: 1456,
    });
  });
  it('should set nothing', () => {
    const reducer = createReducer(getInitialState()).replace(textAction, () => {
      return nothing;
    });
    const state = reducer(undefined, textAction('text'));
    expect(state).toEqual(undefined);
  });
});

describe('mergePayload', () => {
  it('should set values', () => {
    const reducer = createReducer(getInitialState()).mergePayload(strAction);
    const state = reducer(undefined, strAction('text'));
    expect(state).toEqual({
      ...getInitialState(),
      str: 'text',
    });
  });
});

describe('nested', () => {
  const getInitialStateNested = () => ({
    str: 'foo',
    inner: {
      prop: 'str',
      n: 10,
      arr: [1, 2, 3],
    },
  });

  it('should merge values', () => {
    const reducer = createReducer(getInitialStateNested()).nested(
      'inner',
      innerReducer =>
        innerReducer.on(textAction, (state, { text }, action) => {
          state.prop = text;
          state.n = 1456;
        })
    );
    const ret = reducer(undefined, textAction('text'));
    const expected = getInitialStateNested();
    expected.inner.prop = 'text';
    expected.inner.n = 1456;
    expect(ret).toEqual(expected);
  });

  it('with non nested action', () => {
    const reducer = createReducer(getInitialStateNested())
      .on(textAction, (state, { text }) => {
        state.str = text;
      })
      .nested('inner', innerReducer =>
        innerReducer.on(textAction, (state, { text }) => {
          state.prop = text;
          state.n = 1456;
        })
      );
    const ret = reducer(undefined, textAction('text'));
    const expected = getInitialStateNested();
    expected.str = 'text';
    expected.inner.prop = 'text';
    expected.inner.n = 1456;
    expect(ret).toEqual(expected);
  });
});

describe('attach', () => {
  function getReducer() {
    return createReducer(getInitialState()).attach((state, action) => {
      if (action.type === textAction.toString()) {
        return {
          ...state,
          str: action.payload.text,
        };
      }
      return state;
    });
  }

  function getInnerReducer() {
    return createReducer(getInitialState()).attach('inner', (state, action) => {
      if (action.type === textAction.toString()) {
        return {
          ...state,
          prop: action.payload.text,
        };
      }
      return state;
    });
  }

  it('attach custom reducer', () => {
    const reducer = getReducer();
    const newState = reducer(undefined, textAction('text'));
    expect(newState).toEqual({
      ...getInitialState(),
      str: 'text',
    });
  });
  it('attach custom reducer on custom path', () => {
    const reducer = getInnerReducer();
    const newState = reducer(undefined, textAction('text'));
    expect(newState).toEqual({
      ...getInitialState(),
      inner: {
        prop: 'text',
      },
    });
  });
  it('should ignore action', () => {
    const reducer = getInnerReducer();
    const ret = reducer(undefined, textAction2('text'));
    expect(ret).toEqual({
      ...getInitialState(),
    });
  });
});
