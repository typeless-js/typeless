import * as React from 'react';
import { Registry } from './Registry';

export const TypelessContext = React.createContext(null as null | {
  registry: Registry;
});

export const defaultRegistry = new Registry();

export function DefaultTypelessProvider({
  children,
}: {
  children: React.ReactChild;
}) {
  const value = React.useMemo(() => ({ registry: defaultRegistry }), []);
  return (
    <TypelessContext.Provider value={value}>
      {children}
    </TypelessContext.Provider>
  );
}
