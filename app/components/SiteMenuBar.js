// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import uiActions from '../actions/ui';
import { ReactComponent as CollectionIcon } from '../icons/svg/collection.svg';
import { ReactComponent as DashboardIcon } from '../icons/svg/dashboard.svg';

class SiteMenuBar extends Component {
  static handleMouseOver() {
    if (document && document.body) {
      document.body.classList.toggle('site-menubar-hover', true);
    }
  }

  static handleMouseOut() {
    if (document && document.body) {
      document.body.classList.toggle('site-menubar-hover', false);
    }
  }

  static emptyfn() {}

  static propTypes = {
    toggleFilter: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired
  };

  toggleFilter = e => {
    e.preventDefault();
    this.props.toggleFilter();
  };

  render() {
    const { pathname } = this.props.router.location;
    const classNormal = 'site-menu-item';
    const classNormalSub = 'site-menu-item has-sub';
    const classActive = 'site-menu-item open active';
    const classActiveSub = 'site-menu-item has-sub open active';

    return (
      // Disable expand on hover for now
      // onMouseOver={SiteMenuBar.handleMouseOver} onMouseOut={SiteMenuBar.handleMouseOut}
      <div className="site-menubar mm-menu mm-hasnavbar-bottom-1">
        <div className="mm-navbar mm-navbar-bottom mm-navbar-bottom-1 mm-navbar-size-1">
          <div className="site-menubar-footer">
            <a
              href=""
              className="fold-show"
              data-placement="top"
              data-toggle="tooltip"
              data-original-title="Settings"
            >
              <span className="icon wb-settings" aria-hidden="true" />
            </a>
            <a
              href=""
              data-placement="top"
              data-toggle="tooltip"
              data-original-title="Lock"
            >
              <span className="icon wb-eye-close" aria-hidden="true" />
            </a>
            <a
              href=""
              data-placement="top"
              data-toggle="tooltip"
              data-original-title="Logout"
            >
              <span className="icon wb-power" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="mm-panels is-disabled">
          <div className="mm-panel mm-hasnavbar mm-opened mm-current" id="mm-0">
            <div className="mm-navbar">
              <a className="mm-title">Menu</a>
            </div>
            <ul className="site-menu mm-listview">
              <li
                className={
                  pathname === '/dashboard' ? classActive : classNormal
                }
              >
                <Link to="/dashboard">
                  <DashboardIcon className="site-menu-icon" />
                  <span className="site-menu-title">Dashboard</span>
                  <span className="site-menu-arrow" />
                </Link>
              </li>
              <li
                className={
                  pathname === '/groups' ? classActiveSub : classNormalSub
                }
              >
                <Link
                  to="/groups"
                  onClick={
                    pathname === '/groups'
                      ? this.toggleFilter
                      : SiteMenuBar.emptyfn()
                  }
                >
                  <CollectionIcon className="site-menu-icon" />
                  <span className="site-menu-title">Groups</span>
                  <span className="site-menu-arrow" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    router: state.router
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleFilter: () => {
      dispatch(uiActions.setUi({ groupFilter: true }));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SiteMenuBar);
