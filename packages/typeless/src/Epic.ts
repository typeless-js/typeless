import { Observable, defer, from, of, empty } from 'rxjs';
import {
  AC,
  Deps,
  ExtractPayload,
  ActionLike,
  ActionType,
  Action,
} from './types';
import { getACType, isAction } from './utils';
import { mergeMap, catchError } from 'rxjs/operators';

export type EpicResult =
  | Observable<ActionLike | null>
  | Promise<ActionLike | null>
  | ActionLike
  | ActionLike[]
  | null;

export type EpicHandler<TAC extends AC> = (
  payload: ExtractPayload<ReturnType<TAC>>,
  deps: Deps,
  action: ReturnType<TAC> & { type: symbol }
) => EpicResult;

export class Epic {
  private handlers: Map<
    symbol,
    Map<string, Array<EpicHandler<any>>>
  > = new Map();
  private moduleHandlers: Map<symbol, Array<EpicHandler<any>>> = new Map();

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

  onModule(moduleSymbol: symbol, handler: EpicHandler<AC>) {
    if (!this.moduleHandlers.has(moduleSymbol)) {
      this.moduleHandlers.set(moduleSymbol, []);
    }
    this.moduleHandlers.get(moduleSymbol!)!.push(handler);
    return this;
  }

  // tslint:disable-next-line:no-empty
  toStream(sourceAction: Action, deps: Deps, log: () => void = () => {}) {
    return this.getHandlers(sourceAction).map(handler => {
      return defer(() => {
        log();
        const result = handler(sourceAction.payload, deps, sourceAction);
        if (Array.isArray(result)) {
          return from(result);
        }
        if (isAction(result) || result === null) {
          return of(result);
        }

        return result;
      }).pipe(
        mergeMap((action: unknown) => {
          if (action === null) {
            // ignore if action is null
            return empty();
          }
          if (action === undefined) {
            console.error('Undefined action returned in epic.', {
              action,
              store: name,
            });
            return empty();
          }
          if (!isAction(action)) {
            console.error('Invalid action returned in epic.', {
              sourceAction,
              action,
              store: name,
            });
            return empty();
          }
          return of(action);
        }),
        catchError(err => {
          console.error(
            'An unhandled error occurred in epic.',
            {
              sourceAction,
              store: name,
            },
            err
          );
          return empty();
        })
      );
    });
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

  private add(ac: AC | AC[], handler: EpicHandler<AC>) {
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

  private getHandlers(action: Action) {
    const [symbol, type] = action.type;
    return [
      ...(this.handlers.has(symbol) && this.handlers.get(symbol)!.has(type)
        ? this.handlers.get(symbol)!.get(type)
        : []),
      ...(this.moduleHandlers.has(symbol)
        ? this.moduleHandlers.get(symbol)
        : []),
    ];
  }
}
