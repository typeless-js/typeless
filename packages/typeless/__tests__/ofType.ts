import { Subject } from 'rxjs';
import { ofType } from '../src/ofType';
import { createActions } from '../src/createActions';
import { toArray } from 'rxjs/operators';

const Actions = createActions('sample', {
  foo: (n: number) => ({ payload: { n } }),
  bar: (n: number) => ({ payload: { n } }),
  baz: (n: number) => ({ payload: { n } }),
});

test('should filter single action', async () => {
  const sub = new Subject<any>();
  const ret = sub
    .pipe(
      ofType(Actions.foo),
      toArray()
    )
    .toPromise();
  sub.next(Actions.foo(1));
  sub.next(Actions.bar(0));
  sub.next(Actions.foo(2));
  sub.complete();
  expect(await ret).toEqual([Actions.foo(1), Actions.foo(2)]);
});

test('should filter multiple actions', async () => {
  const sub = new Subject<any>();
  const ret = sub
    .pipe(
      ofType([Actions.foo, Actions.bar]),
      toArray()
    )
    .toPromise();
  sub.next(Actions.foo(1));
  sub.next(Actions.bar(1));
  sub.next(Actions.baz(0));
  sub.next(Actions.foo(2));
  sub.complete();
  expect(await ret).toEqual([Actions.foo(1), Actions.bar(1), Actions.foo(2)]);
});
