import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { TypelessContext } from '../src/TypelessContext';
import { Registry } from '../src/Registry';

export function renderWithProvider(
  node: React.ReactChild,
  container: HTMLElement,
  registry: Registry
) {
  act(() => {
    ReactDOM.render(
      <TypelessContext.Provider value={{ registry }}>
        {node}
      </TypelessContext.Provider>,
      container
    );
  });
}
