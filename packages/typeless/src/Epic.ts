import { Observable } from 'rxjs';
import { AC, Deps, ExtractPayload, ActionLike } from './types';

export type EpicResult = Observable<ActionLike> | ActionLike | ActionLike[];

export type HandlerFn = (
  deps: Deps
) => (action: ActionLike) => Observable<EpicResult>;

export type EpicHandler<TAC extends AC> = (
  payload: ExtractPayload<ReturnType<TAC>>,
  deps: Deps,
  action: ReturnType<TAC> & { type: symbol }
) => EpicResult;

export class Epic {
  handlers: Map<symbol, EpicHandler<any>[]> = new Map();
  attach(epic: Epic) {
    const subHandlers = epic.handlers;
    for (const key of epic.handlers.keys()) {
      this.createKey(key);
      this.handlers.get(key).push(...subHandlers.get(key));
    }
    return this;
  }

  on<TAC extends AC>(ac: TAC, handler: EpicHandler<TAC>) {
    return this.add(ac, handler);
  }
  onMany<TAC extends AC, TAC2 extends AC>(
    ac: [TAC, TAC2],
    handler: EpicHandler<TAC | TAC2>
  ): this;
  onMany<TAC extends AC, TAC2 extends AC, TAC3 extends AC>(
    ac: [TAC, TAC2, TAC3],
    handler: EpicHandler<TAC | TAC2 | TAC3>
  ): this;
  onMany<TAC extends AC, TAC2 extends AC, TAC3 extends AC, TAC4 extends AC>(
    ac: [TAC, TAC2, TAC3, TAC4],
    handler: EpicHandler<TAC | TAC2 | TAC3 | TAC4>
  ): this;
  onMany<
    TAC extends AC,
    TAC2 extends AC,
    TAC3 extends AC,
    TAC4 extends AC,
    TAC5 extends AC
  >(
    ac: [TAC, TAC2, TAC3, TAC4, TAC5],
    handler: EpicHandler<TAC | TAC2 | TAC3 | TAC4 | TAC5>
  ): this;
  onMany(ac: AC[], handler: EpicHandler<AC>) {
    return this.add(ac, handler);
  }

  private createKey(key: symbol) {
    if (!this.handlers.has(key)) {
      this.handlers.set(key, []);
    }
  }

  private add(ac: AC | AC[], handler: EpicHandler<AC>) {
    const keys = Array.isArray(ac)
      ? ac.map(x => x.getSymbol())
      : [ac.getSymbol()];
    keys.forEach(key => {
      this.createKey(key);
      this.handlers.get(key).push(handler);
    });
    return this;
  }
}
