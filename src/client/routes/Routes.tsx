import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import RoutesPath from '../models/RoutesPath.model';

import Home from '../containers/Home';
import Search from '../containers/Search';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={RoutesPath.Home} render={() => <Home />} />
      <Route path={RoutesPath.Search} render={() => <Search />} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
