import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { SocketActions } from '../interface';

export function SocketView() {
  const { stopC, startC } = useActions(SocketActions);
  const { a, b, c, isCRunning } = useMappedState(state => state.socket);
  const textAreaStyles: React.CSSProperties = { width: '100%', height: 100 };
  return (
    <div>
      <h2>Module A</h2>
      <p>HMR reloads ignored</p>
      <textarea readOnly value={a.join('\n')} style={textAreaStyles} />
      <hr />
      <h2>Module B</h2>
      <p>HMR reloads handled</p>
      <textarea readOnly value={b.join('\n')} style={textAreaStyles} />
      <hr />
      <h2>Module C</h2>
      <p>
        HMR reloads handled <br /> Start/stop socket
      </p>
      <textarea readOnly value={c.join('\n')} style={textAreaStyles} />
      {isCRunning ? (
        <button onClick={stopC}>stop</button>
      ) : (
        <button onClick={startC}>start</button>
      )}
      <hr />

      <small>
        Open <code>src/features/components/module.tsx</code> and edit{' '}
        <code>CHANGE_ME</code> to trigger HMR. <br />
        Also, check comments in the source code.
      </small>
    </div>
  );
}
