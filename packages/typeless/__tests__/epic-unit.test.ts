import { asyncScheduler, merge, of, VirtualTimeScheduler } from 'rxjs';
import { delay, observeOn, subscribeOn } from 'rxjs/operators';
import { createModule } from '../src/createModule';
import { Epic } from '../src/Epic';
import { Deps } from '../src/types';

describe('Epic#toStream', () => {
  it('should return next Action from sourceAction', async () => {
    const Actions = createModule(Symbol('sample')).withActions({
      a: null,
      b: null,
      c: null,
    })[1];

    const epic = new Epic()
      .on(Actions.a, () => Promise.resolve(Actions.b()))
      .on(Actions.a, () => of(Actions.c()));

    const results = [];
    await merge(...epic.toStream(Actions.a(), {} as Deps)).forEach(action =>
      results.push(action)
    );
    expect(results).toMatchObject([Actions.c(), Actions.b()]);
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
      const results = [];
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
});
