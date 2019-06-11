import React from 'react';
import ReactDOM from 'react-dom';
import { DefaultTypelessProvider } from 'typeless';
import { Link, getRouterState } from 'typeless-router';
import { useRouter } from './router';

function App() {
  useRouter();
  const { location } = getRouterState.useState();

  return (
    <div>
      <Link href="/page-a">page a</Link> | <Link href="/page-b">page b</Link>
      <br />
      Current location: {location.pathname}
    </div>
  );
}

ReactDOM.render(
  <DefaultTypelessProvider>
    <App />
  </DefaultTypelessProvider>,
  document.getElementById('app')
);
