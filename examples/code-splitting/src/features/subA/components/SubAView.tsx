import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { SubAActions } from '../interface';

export function SubAView() {
  const { increase } = useActions(SubAActions);
  const { counter } = useMappedState(state => state.subA);

  return (
    <div>
      Module A. <br />
      Counter {counter} <br />
      <button onClick={increase}>increase</button>
    </div>
  );
}
