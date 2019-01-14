// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { forEach } from 'lodash';
import './Login.global.css';
import Events from '../core/events';
import NotificationsQueue from './NotificationsQueue';
import Input from './common/textInput';

type Props = {
  setValue: () => mixed,
  login: () => mixed,
  loginImage: () => mixed,
  isFetching: boolean,
  api: {},
  image?: string
};

type State = {
  version: string | null
};

class Login extends Component<Props, State> {
  static defaultProps = {
    image: ''
  };

  constructor() {
    super();
    this.state = {
      version: window.require('electron').remote.app.getVersion()
    };
  }

  componentDidMount() {
    this.props.loginImage();
  }

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.props.login();
    }
  };

  render() {
    const { setValue, login, api, image, isFetching } = this.props;
    const { user, password, host } = api;

    return (
      <div className="page-content">
        {image !== '' && <img alt="" className="login-bg" src={image} />}
        <div className="page-login-main animation-slide-right animation-duration-1">
          <div className="app-info">
            <div className="font-size-24">SHOKO DESKTOP</div>
            Version {this.state.version}
          </div>
          <h3 className="font-size-24">Welcome back</h3>
          <p>Please enter your login details below.</p>
          <form method="post" action="">
            <Input
              name="username"
              placeholder="Username"
              value={user}
              onChange={e => {
                setValue('user', e.target.value);
              }}
              onKeyPress={this.handleKeyPress}
            />
            <Input
              name="password"
              placeholder="Password"
              value={password}
              onChange={e => {
                setValue('password', e.target.value);
              }}
              onKeyPress={this.handleKeyPress}
            />
            <Input
              name="server"
              placeholder="Server address"
              value={host}
              onChange={e => {
                setValue('host', e.target.value);
              }}
              onKeyPress={this.handleKeyPress}
            />
            <button
              disabled={isFetching}
              type="button"
              className="btn btn-primary btn-block"
              onClick={login}
            >
              {isFetching ? (
                <div className="loader loader-circle" />
              ) : (
                'Sign in'
              )}
            </button>
          </form>
          <footer className="page-copyright">
            <div className="panel panel-bordered panel-dark">
              <div className="panel-heading">
                <h3 className="panel-title">AUTO-LOGIN</h3>
              </div>
              <div className="panel-body">
                You can change the default login behavior by navigating to
                Settings &gt; User.
              </div>
            </div>
          </footer>
        </div>
        <NotificationsQueue />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setValue: (field, value) => {
      dispatch({ type: Events.API_SET_VALUE, payload: { field, value } });
    },
    login: () => {
      dispatch({ type: Events.LOGIN });
    },
    loginImage: () => {
      dispatch({ type: Events.LOGIN_IMAGE });
    }
  };
}

function mapStateToProps(state) {
  const { api, ui, queue } = state;
  let isFetching = false;
  forEach(queue.api, req => {
    if (req.status === 'Processing' || req.status === 'Pending') {
      isFetching = true;
    }
  });

  return {
    api,
    isFetching,
    image: ui.loginImage || ''
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
