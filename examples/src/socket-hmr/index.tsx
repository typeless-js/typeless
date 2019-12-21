import React from 'react';
import ReactDOM from 'react-dom';
import { Hmr, startHmr, DefaultTypelessProvider } from 'typeless';

const MOUNT_NODE = document.getElementById('app');

const render = () => {
  const App = require('./components/App').App;
  ReactDOM.unmountComponentAtNode(MOUNT_NODE);
  ReactDOM.render(
    <Hmr>
      <DefaultTypelessProvider>
        <App />
      </DefaultTypelessProvider>
    </Hmr>,
    MOUNT_NODE
  );
};

if (module.hot) {
  module.hot.accept(() => {
    startHmr();
    render();
  });
}
render();
