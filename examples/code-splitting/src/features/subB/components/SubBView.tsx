import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { SubBActions } from '../interface';

export function SubBView() {
  const { decrease } = useActions(SubBActions);
  const { counter } = useMappedState(state => state.subB);

  return (
    <div>
      Module B. <br />
      Counter {counter} <br />
      <button onClick={decrease}>decrease</button>
    </div>
  );
}
