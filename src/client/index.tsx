import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import appReducer from '../shared/redux/reducers/reducers';
import { useReduxDevTools } from './setting';

import App from './App';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    __PRELOADED_STATE__: any;
  }
}

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;
// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;
// Create Redux store with initial state
const composeEnhancers = ((useDevTool) => {
  if (useDevTool === 'true') return composeWithDevTools({ trace: true });
  return compose;
})(useReduxDevTools);

const store = createStore(appReducer, preloadedState, composeEnhancers(applyMiddleware(thunkMiddleware)));

// client only run has module.hot
const rootElement = document.getElementById('root');
loadableReady(() => {
  ReactDOM.hydrate(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
    rootElement,
  );
});

if (module.hot) {
  module.hot.accept();
}
