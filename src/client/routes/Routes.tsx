import React from 'react';
import loadable from '@loadable/component';
import { Route, Switch } from 'react-router';
import RoutesPath from '../models/RoutesPath.model';

const Home = loadable(() => import(/* webpackChunkName: "Home" */ '../containers/Home'));
const Search = loadable(() => import(/* webpackChunkName: "News" */ '../containers/Search'));

const Routes = () => (
  <Switch>
    <Route exact path={RoutesPath.Home} render={() => <Home />} />
    <Route path={RoutesPath.Search} render={() => <Search />} />
  </Switch>
);

export default Routes;
