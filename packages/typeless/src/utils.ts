import { ActionLike } from './types';

export const isAction = (action: any): action is ActionLike => {
  return action && typeof (action as any).type === 'string';
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

export const logAction = (epicName: string, action: any) => {
  const gray = 'color: gray; font-weight: lighter;';
  const bold = 'font-weight: bold';
  const boldBlue = 'font-weight: bold; color: blue';
  const boldRed = 'font-weight: bold; color: red';
  const actionType = action.type as string;
  const time = formatTime(new Date());
  if (!actionType.startsWith(epicName)) {
    // tslint:disable-next-line:no-console
    console.log(
      `%c epic%c ${epicName}%c:%c${action.type} %c@ ${time}`,
      gray,
      boldBlue,
      gray,
      boldRed,
      gray
    );
  } else {
    // tslint:disable-next-line:no-console
    console.log(`%c epic%c ${action.type} %c@ ${time}`, gray, bold, gray);
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
