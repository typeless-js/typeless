import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { SubCActions } from '../interface';

export function SubCView() {
  const { double } = useActions(SubCActions);
  const { counter } = useMappedState(state => state.subC);

  return (
    <div>
      Module C. <br />
      Counter {counter} <br />
      <button onClick={double}>double</button>
    </div>
  );
}
