import React from 'react';
import * as Rx from 'typeless/rx';
import {
  SocketActions,
  SocketState,
  useModule,
  getSocketState,
} from './interface';
import { SocketView } from './components/SocketView';
import { socket } from '../../socket';

// change this value to trigger HMR
const CHANGE_ME = '(FOO) ';

const subscribe = (fn: (text: string) => void) => {
  socket.addListener('message', fn);
  return () => {
    socket.removeListener('message', fn);
  };
};

useModule
  .epic()
  // Handler A:
  // ignore HMR reloads
  // handler won't be updated once loaded to the root epic
  // hence it will always reference the initial CHANGE_ME value
  // use this approach if creating subscription is expensive
  .on(
    SocketActions.$mounted,
    () =>
      new Rx.Observable(subscriber => {
        return subscribe(text => {
          console.log('handler A:', text);
          subscriber.next(SocketActions.messageReceived('a', CHANGE_ME + text));
        });
      })
  )
  // Handler B:
  // handle HMR reloads
  // resubscribe on every HMR event
  .onMany(
    [SocketActions.$mounted, SocketActions.$remounted],
    (_, { action$ }) => {
      console.log('!!!@@@@@@@@@@@@@@@@@@@@@@@@@');
      return new Rx.Observable(subscriber => {
        const dispose = subscribe(text => {
          console.log('handler B:', text);
          subscriber.next(SocketActions.messageReceived('b', CHANGE_ME + text));
        });
        return () => {
          console.log('######################');
          dispose();
        };
      }).pipe(
        Rx.takeUntil(
          action$.pipe(
            Rx.ofType([SocketActions.$unmounted, SocketActions.$remounted])
          )
        )
      );
    }
  )
  // Handler C:
  // handle HMR reloads
  // resubscribe on every HMR event
  // started only on action `startC`
  // stopped only on action `stopC`
  .onMany(
    [SocketActions.startC, SocketActions.$remounted],
    (_, { action$ }) => {
      if (!getSocketState().isCRunning) {
        return Rx.empty();
      }
      return new Rx.Observable(subscriber => {
        return subscribe(text => {
          console.log('handler C:', text);
          subscriber.next(SocketActions.messageReceived('c', CHANGE_ME + text));
        });
      }).pipe(
        Rx.takeUntil(
          action$.pipe(
            Rx.ofType([
              SocketActions.$unmounted,
              SocketActions.$remounted,
              SocketActions.stopC,
            ])
          )
        )
      );
    }
  );

const initialState: SocketState = {
  a: [],
  b: [],
  c: [],
  isCRunning: false,
};

useModule
  .reducer(initialState)
  .on(SocketActions.messageReceived, (state, { container, text }) => {
    state[container].unshift(text);
  })
  .on(SocketActions.startC, state => {
    state.c.unshift('started');
    state.isCRunning = true;
  })
  .on(SocketActions.stopC, state => {
    state.c.unshift('stopped');
    state.isCRunning = false;
  });

export default function SocketModule() {
  useModule();

  return <SocketView />;
}
