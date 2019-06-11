import * as Rx from './src/rx';

const createModule = (symbol: symbol | string) => {
  return null as {
    withActions(
      ...args: any[]
    ): {
      withState<T>(): any;
    };
  };
};
function fetchCatData() {
  return Rx.of({
    imageUrl: `https://cataas.com/cat/gif?_t=${Date.now()}`,
  }).pipe(
    Rx.delay(2000),
    Rx.map(cat => {
      if (Date.now() % 2 === 0) {
        throw new Error('Failed to load cat');
      }
      return cat;
    })
  );
}

const createStore: any = null;
const store = createStore('users');

// interface
export interface CounterState {
  isLoading: boolean;
  count: number;
}

// const usersSymbol = Symbol('users');

export const [ghandle, GlobalActions, getGlobalState] = createModule('global')
  .withActions({
    startCount: null, // null means no args
    countDone: (count: number) => ({ payload: { count } }),
  })
  .withState<CounterState>();

export const [handle, UserActions, getUsersState] = createModule('users')
  // .withDeps({
  //   global: getGlobalState,
  // })
  .withActions({
    startCount: null, // null means no args
    countDone: (count: number) => ({ payload: { count } }),
  })
  .withState<CounterState>();

// module

const initialState: any = null;
const CatActions: any = null;

const useUsersModule = handle
  .addReducer(initialState, reducer => {
    reducer.on(UserActions.countDone, state => {
      //
    });
  })
  .addEpic((epic, { action$, set }) => {
    epic
      .on(UserActions.countDone, ({ data }) => {
        getGlobalState.update(state => {
          state.data = data;
        });
      })
      .on(CatActions.loadCat, ({ data }) =>
        Rx.concatObs(
          CatActions.set({ isLoading: true }),
          fetchCatData().pipe(
            Rx.map(cat => CatActions.set({ cat })),
            Rx.catchError(err => {
              console.error(err);
              return Rx.of(CatActions.errorOcurred(err.message));
            }),
            Rx.takeUntil(action$.pipe(Rx.waitForType(CatActions.cancel)))
          ),
          CatActions.set({ isLoading: false })
        )
      );
  });

function Users() {
  useUsersModule();

  return <div>users</div>;
}

const createSelector: any = null;
const useMappedState: any = null;
const useSelector: any = null;

const getX = createSelector()
  .pick(getUsersState, state => state.x)
  .fn(x => {
    //
  });

const getSomeState = createSelector()
  .compose(getX)
  .pick(getUsersState, state => state.foo)
  .pick(getUsersState, state => state.bar)
  .fn((x, foo, bar) => {
    //
  });

const getSomeState2 = createSelector(
  [
    //
    getX,
    [getUsersState, state => state.foo],
    [getUsersState, state => state.bar],
  ],
  (x, foo, bar) => {
    //
  }
);
// .compose(getX)
// .pick(getUsersState, state => state.foo)
// .pick(getUsersState, state => state.bar)
// .fn((x, foo, bar) => {
//   //
// });

const createDeps: any = null;

const userDeps = createDeps({
  global: getGlobalState,
  users: getUsersState,
});

userDeps.createSelector(
  state => state.global.a,
  state => state.users.b,
  (a, b) => {
    //
  }
);

function ExampleCom() {
  userDeps.useMappedState(state => ({
    a: state.users.a,
    b: state.global.b,
  }));

  useMappedState([getUsersState, getGlobalState], (users, global) => ({
    a: users.a,
    b: global.b,
  }));
  const { x, y } = useSelector(getSomeState);

  return <div>a</div>;
}
