import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Routes from './routes/Routes';

const App = () => (
  <ErrorBoundary>
    <Routes />
  </ErrorBoundary>
);

export default App;
