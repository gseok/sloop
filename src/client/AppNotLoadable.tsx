import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Routes from './routes/RoutesNotLoadable';

import css from './App.module.scss';

const App = () => (
  <ErrorBoundary>
    <div className={css.App}>
      <Routes />
    </div>
  </ErrorBoundary>
);

export default App;
