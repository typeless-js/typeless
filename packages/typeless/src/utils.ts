import { ActionLike, AC, Action } from './types';

export const isAction = (action: any): action is ActionLike => {
  return action && typeof (action as any).type === 'symbol';
};

export const repeat = (str: string, times: number) =>
  new Array(times + 1).join(str);

export const pad = (num: number, maxLength: number) =>
  repeat('0', maxLength - num.toString().length) + num;

export const formatTime = (time: Date) =>
  `${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(
    time.getSeconds(),
    2
  )}.${pad(time.getMilliseconds(), 3)}`;

  export function getDescription(s: symbol) {
    const match = /Symbol\((.+)\)/.exec(s.toString());
    if (!match) {
      throw new Error('Empty symbol: ' + s.toString());
    }
    return match[1];
  }

  
export const logAction = (epicName: string, action: Action) => {
  const gray = 'color: gray; font-weight: lighter;';
  const bold = 'font-weight: bold';
  const boldBlue = 'font-weight: bold; color: blue';
  const boldRed = 'font-weight: bold; color: red';
  const actionType = getDescription(action.type);
  const time = formatTime(new Date());
  if (!actionType.startsWith(epicName)) {
    // tslint:disable-next-line:no-console
    console.log(
      `%c epic%c ${epicName}%c:%c${actionType} %c@ ${time}`,
      gray,
      boldBlue,
      gray,
      boldRed,
      gray
    );
  } else {
    // tslint:disable-next-line:no-console
    console.log(`%c epic%c ${actionType} %c@ ${time}`, gray, bold, gray);
  }
};

// FROM https://github.com/huynhsamha/js-snakecase/blob/master/index.js
// ISC
export const snakeCase = (str: string) => {
  if (!str) return '';

  return String(str)
    .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
    .replace(/([a-z])([A-Z])/g, (m, a, b) => a + '_' + b.toLowerCase())
    .replace(/[^A-Za-z0-9]+|_+/g, '_')
    .toLowerCase();
};

export const toArray = <T>(input: T | T[]): T[] =>
  Array.isArray(input) ? input : [input];

export function shallowEqual(a: any[] | null, b: any[] | null) {
  if (!a || !b || a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

export function memoize(fn: (...args: any[]) => any) {
  let lastArgs: any[] | null = null;
  let lastResult: any[];

  return (...args: any[]) => {
    if (!shallowEqual(args, lastArgs)) {
      lastResult = fn(...args);
    }
    lastArgs = args;
    return lastResult;
  };
}

export function getACSymbol(ac: AC) {
  if (!ac.getSymbol) {
    throw new Error(
      'getSymbol() not defined in Action Creator: ' + ac.toString()
    );
  }
  return ac.getSymbol();
}
