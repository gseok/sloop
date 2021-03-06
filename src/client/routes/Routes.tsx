import React from 'react';
import loadable from '@loadable/component';
import { Route, Switch } from 'react-router';
import RoutesPath from '../models/RoutesPath.model';
import Loading from '../components/Loading';

const Home = loadable(() => import(/* webpackChunkName: "Home" */ '../views/Home'), {
  fallback: <Loading />,
});
const Search = loadable(() => import(/* webpackChunkName: "Search" */ '../views/Search'), {
  fallback: <Loading />,
});

const Routes = () => (
  <Switch>
    <Route exact path={RoutesPath.Home} render={() => <Home />} />
    <Route path={RoutesPath.Search} render={() => <Search />} />
  </Switch>
);

export default Routes;
