import React from 'react';
import { Route, Switch } from 'react-router';
import RoutesPath from '../models/RoutesPath.model';
import Home from '../views/Home';
import Search from '../views/Search';

const Routes = () => (
  <Switch>
    <Route exact path={RoutesPath.Home} render={() => <Home />} />
    <Route path={RoutesPath.Search} render={() => <Search />} />
  </Switch>
);

export default Routes;
