/* tslint:disable:no-console */

import { Store } from './Store';
import { ActionLike } from './types';
import { formatTime, getActionDescription } from './utils';

export class StateLogger {
  private prevState: any = {};
  private nextState: any = {};
  private start: number | null = null;
  private end: number | null = null;

  constructor(private stores: Array<Store<any>>) {}

  setState(type: 'prevState' | 'nextState', state: any) {
    if (type === 'nextState') {
      this.end = Date.now();
    }

    this[type] = state;

    if (type === 'prevState') {
      this.start = Date.now();
    }
  }

  log(action: ActionLike) {
    if (!this.end || !this.start) {
      throw new Error('prev or next state not calculated');
    }
    const gray = 'color: gray; font-weight: lighter;';
    const bold = 'font-weight: bold';
    const boldBlue = 'font-weight: bold; color: blue';
    const boldBlack = 'font-weight: bold; color: black';
    const boldGray = 'font-weight: bold; color: gray';
    const boldGreen = 'font-weight: bold; color: green';
    const boldRed = 'font-weight: bold; color: red';
    const actionType = getActionDescription(action.type!);
    const duration = (this.end - this.start).toFixed(2);
    const time = formatTime(new Date(this.start));
    const extraArgs = action.payload ? [action.payload] : [];
    if (console.groupCollapsed) {
      console.groupCollapsed(
        `%c action%c ${actionType} %c@ ${time} (in ${duration} ms)%c`,
        gray,
        bold,
        gray,
        boldGreen,
        ...extraArgs
      );
    } else {
      console.log(
        `action  ${actionType} @ ${time} (in ${duration} ms)`,
        ...extraArgs
      );
    }
    console.log('%c prev state', boldGray, this.prevState);
    console.log('%c action   ', boldBlue, action);
    console.log('%c next state', boldGreen, this.nextState);
    if (console.groupEnd) {
      console.groupEnd();
    }
    for (const store of this.stores) {
      const key = store.displayName;
      if (this.prevState[key] !== this.nextState[key]) {
        if (console.group) {
          console.group(`%c   update %c ${key}`, boldRed, boldBlack);
        } else {
          console.log(`   update ${key}`);
        }
        console.log('%c prev state', boldGray, this.prevState[key]);
        console.log('%c next state', boldGreen, this.nextState[key]);
      }
      if (console.groupEnd) {
        console.groupEnd();
      }
    }
  }
}
