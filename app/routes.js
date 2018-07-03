/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import LoginPage from './containers/LoginPage';
import DashboardPage from './containers/DashboardPage';
import SeriesPage from './containers/SeriesPage';
import GroupsPage from './containers/GroupsPage';
import SeriesListPage from './containers/SeriesListPage';

export default () => (
  <App>
    <Switch>
      <Route exact path="/dashboard" component={DashboardPage} />
      <Route exact path="/series" component={SeriesListPage} />
      <Route path="/series/:id" component={SeriesPage} />
      <Route exact path="/groups" component={GroupsPage} />
      <Route exact path="/groups/:id" component={GroupsPage} />
      <Route exact path="/groups/filter/:filterId" component={GroupsPage} />
      <Route exact path="/" component={LoginPage} />
    </Switch>
  </App>
);
