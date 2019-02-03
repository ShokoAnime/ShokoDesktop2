// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Events from '../core/events';
import logoImage from '../images/logo.png';
import { ReactComponent as SearchIcon } from '../icons/svg/search.svg';
import { ReactComponent as MinimizeWindowIcon } from '../icons/svg/windowMinimize.svg';
import { ReactComponent as MaximizeWindowIcon } from '../icons/svg/windowMaximize.svg';
import { ReactComponent as CloseWindowIcon } from '../icons/svg/windowClose.svg';
import RequestQueue from './RequestQueue';

class SiteNavbar extends Component {
  static propTypes = {
    closeWindow: PropTypes.func.isRequired,
    maximizeWindow: PropTypes.func.isRequired,
    minimizeWindow: PropTypes.func.isRequired
  };

  render() {
    const { closeWindow, maximizeWindow, minimizeWindow } = this.props;

    return (
      <nav
        id="window-drag-handle"
        className="site-navbar navbar navbar-default navbar-fixed-top navbar-mega"
      >
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggler hamburger hamburger-close navbar-toggler-left hided"
            data-toggle="menubar"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="hamburger-bar" />
          </button>
          <button
            type="button"
            className="navbar-toggler collapsed"
            data-target="#site-navbar-collapse"
            data-toggle="collapse"
          >
            <i className="icon wb-more-horizontal" aria-hidden="true" />
          </button>
          <div className="navbar-brand navbar-brand-center">
            <img className="navbar-brand-logo" src={logoImage} alt="" />
            <span className="navbar-brand-text hidden-xs-down">
              {' '}
              Shoko Desktop
            </span>
          </div>
          <button
            type="button"
            className="navbar-toggler collapsed"
            data-target="#site-navbar-search"
            data-toggle="collapse"
          >
            <span className="sr-only">Toggle Search</span>
            <i className="icon wb-search" aria-hidden="true" />
          </button>
        </div>
        <div className="navbar-container container-fluid">
          <div
            className="collapse navbar-collapse navbar-collapse-toolbar"
            id="site-navbar-collapse"
          >
            <ul className="nav navbar-toolbar">
              <li className="nav-item">
                <a
                  className="nav-link menu-icon"
                  role="button"
                  href=""
                  onClick={e => {
                    e.preventDefault();
                  }}
                >
                  <RequestQueue />
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link menu-icon"
                  href=""
                  onClick={e => {
                    e.preventDefault();
                  }}
                  role="button"
                >
                  <SearchIcon />
                </a>
              </li>
            </ul>
            <ul className="nav navbar-toolbar navbar-right navbar-toolbar-right">
              <li className="nav-item">
                <a
                  className="nav-link menu-icon"
                  role="button"
                  onClick={minimizeWindow}
                  href=""
                >
                  <MinimizeWindowIcon />
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link menu-icon"
                  role="button"
                  onClick={maximizeWindow}
                  href=""
                >
                  <MaximizeWindowIcon />
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link menu-icon"
                  role="button"
                  onClick={closeWindow}
                  href=""
                >
                  <CloseWindowIcon />
                </a>
              </li>
            </ul>
          </div>
          <div
            className="collapse navbar-search-overlap"
            id="site-navbar-search"
          >
            <form role="search">
              <div className="form-group">
                <div className="input-search">
                  <i
                    className="input-search-icon wb-search"
                    aria-hidden="true"
                  />
                  <input
                    className="form-control"
                    name="site-search"
                    placeholder="Search..."
                    type="text"
                  />
                  <button
                    type="button"
                    className="input-search-close icon wb-close"
                    data-target="#site-navbar-search"
                    data-toggle="collapse"
                    aria-label="Close"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </nav>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    closeWindow: e => {
      e.preventDefault();
      dispatch({ type: Events.EXIT });
    },
    maximizeWindow: e => {
      e.preventDefault();
      dispatch({ type: Events.WINDOW_MAXIMIZE });
    },
    minimizeWindow: e => {
      e.preventDefault();
      dispatch({ type: Events.WINDOW_MINIMIZE });
    }
  };
}

function mapStateToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SiteNavbar);
