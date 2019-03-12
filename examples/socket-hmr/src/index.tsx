import React from 'react';
import ReactDOM from 'react-dom';
import { initialize, onHmr } from 'typeless';

const { TypelessProvider } = initialize();

const MOUNT_NODE = document.getElementById('app');

const render = () => {
  const App = require('./components/App').App;
  ReactDOM.unmountComponentAtNode(MOUNT_NODE);
  ReactDOM.render(
    <TypelessProvider>
      <App />
    </TypelessProvider>,
    MOUNT_NODE
  );
};

if (module.hot) {
  module.hot.accept('./components/App', () => {
    onHmr(render);
  });
}
render();
