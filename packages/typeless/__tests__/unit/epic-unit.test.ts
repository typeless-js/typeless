import { asyncScheduler, merge, of, VirtualTimeScheduler } from 'rxjs';
import { delay, observeOn, subscribeOn } from 'rxjs/operators';
import { createModule } from '../../src/createModule';
import { Epic } from '../../src/Epic';
import { Deps } from '../../src/types';

async function runEpic<T = any[]>(
  sourceEpic: Epic,
  sourceAction: any
): Promise<T[]> {
  const results: T[] = [];
  await merge(
    ...sourceEpic.toStream(sourceAction, {} as Deps)
  ).forEach(action => results.push(action));
  return results;
}

describe('Epic#toStream', () => {
  describe('normally', () => {
    const Actions = createModule(Symbol('sample')).withActions({
      a: null,
      b: null,
      c: null,
    })[1];
    it('should return next Action from sourceAction', async () => {
      const epic = new Epic()
        .on(Actions.a, () => Promise.resolve(Actions.b()))
        .on(Actions.a, () => of(Actions.c()));

      const results = await runEpic(epic, Actions.a());
      expect(results).toMatchObject([Actions.c(), Actions.b()]);
    });

    it('should return next Action from Action Array', async () => {
      const epic = new Epic().on(Actions.a, () => [Actions.b(), Actions.c()]);

      const results = await runEpic(epic, Actions.a());
      expect(results).toMatchObject([Actions.b(), Actions.c()]);
    });

    it('should return next Acton from Action array Promise', async () => {
      const epic = new Epic().on(Actions.a, () =>
        Promise.resolve([Actions.b(), Actions.c()])
      );

      const results = await runEpic(epic, Actions.a());
      expect(results).toMatchObject([Actions.b(), Actions.c()]);
    });

    it('should return next Acton from Action array Observable', async () => {
      const epic = new Epic().on(Actions.a, () =>
        of([Actions.b(), Actions.c()])
      );

      const results = await runEpic(epic, Actions.a());
      expect(results).toMatchObject([Actions.b(), Actions.c()]);
    });

    describe('occurred error', () => {
      const epic = new Epic().on(Actions.a, () => {
        throw new Error('foo error');
      });

      it('should be empty result', async () => {
        const results = await runEpic(epic, Actions.a());
        expect(results).toStrictEqual([]);
      });
      it('should be threw', async () => {
        jest.useFakeTimers();
        await runEpic(epic, Actions.a());
        expect(() => jest.runAllTimers()).toThrowError('foo error');
      });
    });
  });

  describe('with delay', () => {
    let scheduler: VirtualTimeScheduler;

    beforeEach(() => {
      scheduler = new VirtualTimeScheduler();
      asyncScheduler.now = scheduler.now.bind(scheduler);
      asyncScheduler.schedule = scheduler.schedule.bind(scheduler);
    });

    it('should return next Action', () => {
      const Actions = createModule(Symbol('sample')).withActions({
        ping: null,
        pong: null,
      })[1];

      const epic = new Epic().on(Actions.ping, () =>
        of(Actions.pong()).pipe(delay(500))
      );
      const results: any[] = [];
      const o = merge(...epic.toStream(Actions.ping(), {} as Deps)).pipe(
        observeOn(scheduler),
        subscribeOn(scheduler)
      );
      expect(results).toStrictEqual([]);
      o.subscribe(r => results.push(r));
      scheduler.flush();
      expect(results).toStrictEqual([Actions.pong()]);
    });
  });

  describe('Invalid handler', () => {
    const Actions = createModule(Symbol('sample')).withActions({ a: null })[1];
    beforeEach(() => {
      jest.resetAllMocks();
      // tslint:disable-next-line: no-empty
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    describe('returns `undefined`', () => {
      const epic = new Epic().on(Actions.a, () => undefined);
      it('should return empty action', async () => {
        const results = await runEpic(epic, Actions.a());
        expect(results).toStrictEqual([]);
      });

      it('should log error', async () => {
        await runEpic(epic, Actions.a());

        expect(console.error).toBeCalledWith(
          'Invalid action returned in epic.',
          {
            sourceAction: Actions.a(),
            action: undefined,
            store: '',
          }
        );
      });
    });
    describe('returns invalid Action', () => {
      const invalidAction = { type: 'this is invalid action' };
      // @ts-expect-error
      const epic = new Epic().on(Actions.a, () => invalidAction);
      it('should return empty action', async () => {
        const results = await runEpic(epic, Actions.a());
        expect(results).toStrictEqual([]);
      });

      it('should log error', async () => {
        await runEpic(epic, Actions.a());

        expect(console.error).toBeCalledWith(
          'Invalid action returned in epic.',
          {
            sourceAction: Actions.a(),
            action: invalidAction,
            store: '',
          }
        );
      });
    });

    describe('returns invalid Action Array', () => {
      const invalidAction = { type: 'this is invalid action' };
      // @ts-expect-error
      const epic = new Epic().on(Actions.a, () => [invalidAction]);
      it('should return empty action', async () => {
        const results = await runEpic(epic, Actions.a());
        expect(results).toStrictEqual([]);
      });
      it('should log error', async () => {
        await runEpic(epic, Actions.a());

        expect(console.error).toBeCalledWith(
          'Invalid action returned in epic.',
          {
            sourceAction: Actions.a(),
            action: [invalidAction],
            store: '',
          }
        );
      });
    });
    describe('returns invalid Promise Action Array', () => {
      const invalidAction = { type: 'this is invalid action' };
      const epic = new Epic().on(Actions.a, () =>
        // @ts-expect-error
        Promise.resolve([invalidAction])
      );
      it('should return empty action', async () => {
        const results = await runEpic(epic, Actions.a());
        expect(results).toStrictEqual([]);
      });
      it('should log error', async () => {
        await runEpic(epic, Actions.a());

        expect(console.error).toBeCalledWith(
          'Invalid action returned in epic.',
          {
            sourceAction: Actions.a(),
            action: [invalidAction],
            store: '',
          }
        );
      });
    });
  });
});
