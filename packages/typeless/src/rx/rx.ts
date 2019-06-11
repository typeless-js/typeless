import { fromPromise } from 'rxjs/internal-compatibility';

export {
  Subject,
  forkJoin,
  empty,
  of,
  timer,
  from,
  defer,
  Observable,
  interval,
  concat as concatObs,
  merge as mergeObs,
  race as raceObs,
  throwError as throwObs,
} from 'rxjs';

export * from 'rxjs/operators';
export * from './ofType';
export * from './waitForType';

export { fromPromise };

export interface Observer<T> {
  closed?: boolean;
  next: (value: T) => void;
  error: (err: any) => void;
  complete: () => void;
}
