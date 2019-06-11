import React from 'react';
import { useActions } from 'typeless';
import { SubAActions, getSubAState } from '../interface';

export function SubAView() {
  const { increase } = useActions(SubAActions);
  const { counter } = getSubAState.useState();

  return (
    <div>
      Module A. <br />
      Counter {counter} <br />
      <button onClick={increase}>increase</button>
    </div>
  );
}
