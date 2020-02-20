import * as React from 'react';
import { Registry } from './Registry';

export const TypelessContext = React.createContext(null as null | {
  registry: Registry;
});

export const defaultRegistry = new Registry();

export const DefaultTypelessProvider: React.FC = ({ children }) => {
  const value = React.useMemo(() => ({ registry: defaultRegistry }), []);
  return (
    <TypelessContext.Provider value={value}>
      {children}
    </TypelessContext.Provider>
  );
};
