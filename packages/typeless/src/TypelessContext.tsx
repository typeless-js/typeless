import React from 'react';
import { Registry } from './Registry';

export const TypelessContext = React.createContext(null as null | {
  registry: Registry;
});

export function DefaultTypelessProvider({
  children,
}: {
  children: React.ReactChild;
}) {
  const value = React.useMemo(() => ({ registry: new Registry() }), []);
  return (
    <TypelessContext.Provider value={value}>
      {children}
    </TypelessContext.Provider>
  );
}
