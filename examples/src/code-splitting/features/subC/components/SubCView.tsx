import React from 'react';
import { useActions } from 'typeless';
import { SubCActions, getSubCState } from '../interface';

export function SubCView() {
  const { double } = useActions(SubCActions);
  const { counter } = getSubCState.useState();

  return (
    <div>
      Module C. <br />
      Counter {counter} <br />
      <button onClick={double}>double</button>
    </div>
  );
}
