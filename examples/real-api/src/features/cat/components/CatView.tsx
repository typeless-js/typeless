import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { CatActions } from '../interface';

export function CatView() {
  const { loadCat, cancel } = useActions(CatActions);
  const { viewType, cat, error } = useMappedState(state => state.cat);

  const boxStyle: React.CSSProperties = {
    height: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const renderContent = () => {
    switch (viewType) {
      case 'details': {
        return (
          <>
            {cat ? (
              <img src={cat.imageUrl} style={boxStyle} />
            ) : (
              <div style={boxStyle}>No cat loaded yet</div>
            )}
            <button onClick={loadCat}>
              {cat ? 'Load another 😺' : 'Load 😺'}
            </button>
          </>
        );
      }
      case 'loading': {
        return (
          <>
            <div style={boxStyle} />
            <button onClick={cancel}>Loading... Click to cancel</button>
          </>
        );
      }
      case 'error': {
        return (
          <>
            <div style={boxStyle}>
              😿 <br />
              An error occurred: {error}
            </div>
            <button onClick={loadCat}>Click here to retry</button>
          </>
        );
      }
    }
  };

  return (
    <div
      style={{
        width: 400,
        height: 500,
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        margin: '80px auto',
        textAlign: 'center',
      }}
    >
      {renderContent()}
      <div style={{ marginTop: 120, fontSize: 12 }}>
        Click on load multiple times. There is 50% chance for errors.
      </div>
    </div>
  );
}
