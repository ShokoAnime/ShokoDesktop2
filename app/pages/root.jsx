// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import Routes from '../routes';
import ErrorBoundary from '../components/ErrorBoundary';

type Props = {
  store: {},
  history: {}
};

export default class Root extends Component<Props> {
  render() {
    return (
      <Provider store={this.props.store}>
        <ErrorBoundary>
          <ConnectedRouter history={this.props.history}>
            <Routes />
          </ConnectedRouter>
        </ErrorBoundary>
      </Provider>
    );
  }
}
