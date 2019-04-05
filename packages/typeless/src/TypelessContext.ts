import { createContext } from 'react';
import { Registry } from './Registry';

export const TypelessContext = createContext({
  registry: new Registry(),
});
