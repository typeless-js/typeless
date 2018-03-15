import { Epic } from './Epic';
import { DefaultState } from './types';

export const createEpic = <T = DefaultState>(epicName: string) =>
  new Epic<T>(epicName);
