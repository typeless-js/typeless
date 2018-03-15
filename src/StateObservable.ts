/**
 * FROM https://github.com/redux-observable/redux-observable/blob/9a00294905e33d06774aa8c618b4d64e8427891e/src/StateObservable.js
 * MIT
 */
import { Observable, Subject, Subscription } from 'rxjs';

export class StateObservable<S> extends Observable<S> {
  __subscription: Subscription;
  __notifier: any;
  value: S;

  constructor(stateSubject: Observable<S>, initialState: S) {
    super(subscriber => {
      const subscription = this.__notifier.subscribe(subscriber);
      if (subscription && !subscription.closed) {
        subscriber.next(this.value);
      }
      return subscription;
    });

    this.value = initialState;
    this.__notifier = new Subject();
    this.__subscription = stateSubject.subscribe(value => {
      // We only want to update state$ if it has actually changed since
      // redux requires reducers use immutability patterns.
      // This is basically what distinctUntilChanged() does but it's so simple
      // we don't need to pull that code in
      if (value !== this.value) {
        this.value = value;
        this.__notifier.next(value);
      }
    });
  }
}
