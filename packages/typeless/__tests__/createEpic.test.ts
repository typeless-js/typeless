import configureMockStore, { MockStore } from 'redux-mock-store';
import { createEpicMiddleware } from '../src/createEpicMiddleware';
import * as Rx from 'rxjs/operators';
import { of, throwError, concat, empty } from 'rxjs';
import { createActions } from '../src/createActions';
import { createEpic } from '../src/createEpic';
import { ofType } from '../src/ofType';
import { RootEpic } from '../src/RootEpic';

const {
  loadUser,
  loadUserDelay,
  userLoaded,
  errorOccurred,
  deleteUser,
  userDeleted,
  showConfirmDelete,
  confirmDelete,
  hideConfirmDelete,
  loadUserFilter,
} = createActions('ns', {
  loadUser: (id: string) => ({ payload: { id } }),
  loadUserDelay: (id: string) => ({ payload: { id } }),
  loadUserFilter: (id: string) => ({ payload: { id } }),
  deleteUser: (id: string) => ({ payload: { id } }),
  showConfirmDelete: () => ({}),
  hideConfirmDelete: () => ({}),
  confirmDelete: (result: 'yes' | 'no') => ({ payload: { result } }),
  userLoaded: (user: object) => ({ payload: { user } }),
  userDeleted: (id: string) => ({ payload: { id } }),
  errorOccurred: (message: string) => ({ payload: { message } }),
});

const API = {
  fetchUser: (id: string) => of({ id, name: 'user' }),
  fetchUserDelay: (id: string) => of({ id, name: 'user' }).pipe(Rx.delay(10)),
  deleteUser: (id: string) => of(null),
};

interface State {
  foo: string;
}

const epic = createEpic<State>('test')
  //
  .on(loadUser, ({ id }) =>
    API.fetchUser(id).pipe(
      Rx.map(user => userLoaded(user)),
      Rx.catchError(err => of(errorOccurred(err.message)))
    )
  )
  .on(loadUserDelay, ({ id }, { action$ }) =>
    API.fetchUserDelay(id).pipe(
      Rx.map(user => userLoaded(user)),
      Rx.catchError(err => of(errorOccurred(err.message))),
      Rx.takeUntil(action$.pipe(ofType(loadUserDelay)))
    )
  )
  .on(loadUserFilter, ({ id }, { action$ }) => {
    if (id !== 'test') {
      return empty();
    }
    return API.fetchUser(id).pipe(
      Rx.map(user => userLoaded(user)),
      Rx.catchError(err => of(errorOccurred(err.message))),
      Rx.takeUntil(action$.pipe(ofType(loadUserFilter)))
    );
  })
  .on(deleteUser, ({ id }, { action$ }) => {
    return concat(
      of(showConfirmDelete()),
      action$.pipe(
        ofType(confirmDelete),
        Rx.mergeMap(action => {
          if (action.payload.result !== 'yes') {
            return of(hideConfirmDelete());
          }
          return API.deleteUser(id).pipe(
            Rx.map(() => userDeleted(id)),
            Rx.catchError(err => of(errorOccurred(err.message)))
          );
        })
      )
    );
  });

let store: MockStore<any>;

const dispatch = (action: any) => store.dispatch(action);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

beforeEach(() => {
  API.fetchUser = jest.fn((id: string) => of({ id, name: 'user' }));
  API.fetchUserDelay = jest.fn((id: string) =>
    of({ id, name: 'user' }).pipe(Rx.delay(10))
  );

  API.deleteUser = jest.fn((id: string) => of(null));
  const rootEpic = new RootEpic<State>();
  rootEpic.addEpic(epic);
  const epicMiddleware = createEpicMiddleware<State>(rootEpic);
  const mockStore = configureMockStore([epicMiddleware]);
  store = mockStore({});
});

test('should load user', () => {
  dispatch(loadUser('123'));
  const actions = store.getActions();
  expect(actions).toMatchSnapshot();
  expect((API.fetchUser as jest.Mock).mock.calls).toMatchSnapshot();
});

test('should load user error', () => {
  API.fetchUser = jest.fn((id: string) => throwError(new Error('foo')));
  dispatch(loadUser('123'));
  const actions = store.getActions();
  expect(actions).toMatchSnapshot();
  expect((API.fetchUser as jest.Mock).mock.calls).toMatchSnapshot();
});

test('should load user with filter', () => {
  dispatch(loadUserFilter('test'));
  const actions = store.getActions();
  expect(actions).toMatchSnapshot();
  expect((API.fetchUser as jest.Mock).mock.calls).toMatchSnapshot();
});

test('should load user with filter if the filter does not match', () => {
  dispatch(loadUserFilter('abc'));
  const actions = store.getActions();
  expect(actions).toMatchSnapshot();
  expect((API.fetchUser as jest.Mock).mock.calls).toMatchSnapshot();
});

test('should load user with delay', async () => {
  dispatch(loadUserDelay('1'));
  dispatch(loadUserDelay('2'));
  dispatch(loadUserDelay('3'));
  await delay(100);
  const actions = store.getActions();
  expect(actions).toMatchSnapshot();
  expect((API.fetchUserDelay as jest.Mock).mock.calls).toMatchSnapshot();
});

test('should delete user', async () => {
  dispatch(deleteUser('123'));
  dispatch(confirmDelete('yes'));
  const actions = store.getActions();
  expect(actions).toMatchSnapshot();
  expect((API.deleteUser as jest.Mock).mock.calls).toMatchSnapshot();
});

test('attach', () => {
  const subEpic = createEpic<State>('test').on(loadUser, ({ id }) =>
    API.fetchUser(id).pipe(
      Rx.map(user => userLoaded(user)),
      Rx.catchError(err => of(errorOccurred(err.message)))
    )
  );
  const mainEpic = createEpic<State>('test').attach(subEpic);
  const rootEpic = new RootEpic<State>();
  rootEpic.addEpic(mainEpic);
  const epicMiddleware = createEpicMiddleware(rootEpic);
  const mockStore = configureMockStore([epicMiddleware]);
  store = mockStore({});
  dispatch(loadUser('123'));
  const actions = store.getActions();
  expect(actions).toMatchSnapshot();
  expect((API.fetchUser as jest.Mock).mock.calls).toMatchSnapshot();
});
