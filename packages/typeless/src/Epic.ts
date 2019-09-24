import { Observable } from 'rxjs';
import { AC, Deps, ExtractPayload, ActionLike, ActionType } from './types';
import { getACType } from './utils';

export type EpicResult = Observable<ActionLike | null> | Promise<ActionLike | null> | ActionLike | ActionLike[] | null;

export type EpicHandler<TAC extends AC, TState> = (
  payload: ExtractPayload<ReturnType<TAC>>,
  deps: Deps,
  action: ReturnType<TAC> & { type: symbol },
  state: TState
) => EpicResult;

export class Epic {
  handlers: Map<symbol, Map<string, Array<EpicHandler<any, any>>>> = new Map();
  moduleHandlers: Map<symbol, Array<EpicHandler<any, any>>> = new Map();

  attach(epic: Epic) {
    const subHandlers = epic.handlers;
    for (const symbol of epic.handlers.keys()) {
      for (const type of epic.handlers.get(symbol)!.keys()) {
        this.createKey([symbol, type]);
        this.handlers
          .get(symbol)!
          .get(type)!
          .push(...subHandlers.get(symbol)!.get(type));
      }
    }
    return this;
  }

  on<TAC extends AC, TState>(ac: TAC, handler: EpicHandler<TAC, TState>) {
    return this.add(ac, handler);
  }
  onMany<TAC extends AC, TAC2 extends AC, TState>(
    ac: [TAC, TAC2],
    handler: EpicHandler<TAC | TAC2, TState>
  ): this;
  onMany<TAC extends AC, TAC2 extends AC, TAC3 extends AC, TState>(
    ac: [TAC, TAC2, TAC3],
    handler: EpicHandler<TAC | TAC2 | TAC3, TState>
  ): this;
  onMany<TAC extends AC, TAC2 extends AC, TAC3 extends AC, TAC4 extends AC, TState>(
    ac: [TAC, TAC2, TAC3, TAC4],
    handler: EpicHandler<TAC | TAC2 | TAC3 | TAC4, TState>
  ): this;
  onMany<
    TAC extends AC,
    TAC2 extends AC,
    TAC3 extends AC,
    TAC4 extends AC,
    TAC5 extends AC,
    TState
  >(
    ac: [TAC, TAC2, TAC3, TAC4, TAC5],
    handler: EpicHandler<TAC | TAC2 | TAC3 | TAC4 | TAC5, TState>
  ): this;
  onMany<TState>(ac: AC[], handler: EpicHandler<AC, TState>) {
    return this.add(ac, handler);
  }

  onModule<TState>(moduleSymbol: symbol, handler: EpicHandler<AC, TState>) {
    if (!this.moduleHandlers.has(moduleSymbol)) {
      this.moduleHandlers.set(moduleSymbol, []);
    }
    this.moduleHandlers.get(moduleSymbol!)!.push(handler);
  }

  private createKey(actionType: ActionType) {
    const [symbol, type] = actionType;
    if (!this.handlers.has(symbol)) {
      this.handlers.set(symbol, new Map());
    }
    const map = this.handlers.get(symbol)!;
    if (!map.has(type)) {
      map.set(type, []);
    }
  }

  private add<TState>(ac: AC | AC[], handler: EpicHandler<AC, TState>) {
    const keys = Array.isArray(ac)
      ? ac.map(x => getACType(x))
      : [getACType(ac)];
    keys.forEach(([symbol, type]) => {
      this.createKey([symbol, type]);
      this.handlers
        .get(symbol)!
        .get(type)!
        .push(handler);
    });
    return this;
  }
}
