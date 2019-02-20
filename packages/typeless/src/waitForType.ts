import { Action } from 'redux';
import { take } from 'rxjs/operators';
import { ofType } from './ofType';
import { Observable } from 'rxjs';
import { AC } from './types';

export const waitForType = <T extends AC>(ac: T) => (obs: Observable<Action>) =>
  obs.pipe(
    ofType(ac),
    take(1)
  );
