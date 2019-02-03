/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import LoginPage from './pages/login';
import DashboardPage from './pages/dashboard';
import { SeriesPage, SeriesListPage } from './pages/series';
import GroupsPage from './pages/groups';

const VirtualContainer = props => props.children;

export default () => (
  <VirtualContainer>
    <Switch>
      <Route exact path="/dashboard" component={DashboardPage} />
      <Route exact path="/series" component={SeriesListPage} />
      <Route path="/series/:id" component={SeriesPage} />
      <Route exact path="/groups" component={GroupsPage} />
      <Route exact path="/groups/:id" component={GroupsPage} />
      <Route exact path="/groups/filter/:filterId" component={GroupsPage} />
      <Route exact path="/" component={LoginPage} />
    </Switch>
  </VirtualContainer>
);
