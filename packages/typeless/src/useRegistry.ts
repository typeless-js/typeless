import React from 'react';
import { TypelessContext } from './TypelessContext';

export function useRegistry() {
  const context = React.useContext(TypelessContext);
  if (!context) {
    throw new Error(
      'TypelessContext.Provider is not set. Wrap your application with <TypelessContext.Provider> or <DefaultTypelessProvider>'
    );
  }
  return context.registry;
}
