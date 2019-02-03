// @flow
import React, { Component } from 'react';
import Login from '../../components/Login';

export default class LoginPage extends Component {
  componentDidMount() {
    if (document && document.body) {
      document.body.className = 'page-login-v2 layout-full page-dark';
    }
  }

  render() {
    return <Login />;
  }
}
