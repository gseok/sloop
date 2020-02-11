import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';

import App from './App';

// client only run has module.hot
const rootElement = document.getElementById('root');
if (module.hot) {
  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    rootElement,
  );

  module.hot.accept();
} else {
  loadableReady(() => {
    ReactDOM.hydrate(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      rootElement,
    );
  });
}
