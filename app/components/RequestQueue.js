import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { forEach } from 'lodash';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import moment from 'moment';

import { ReactComponent as DashboardIcon } from '../icons/svg/dashboard.svg';
import { ReactComponent as NotificationsIcon } from '../icons/svg/notifications.svg';

import './RequestQueue.global.css';

class RequestQueue extends Component {
  static propTypes = {
    requests: PropTypes.objectOf(
      PropTypes.shape({
        requestId: PropTypes.string,
        status: PropTypes.string
      })
    ).isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false
    };
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  };

  renderItems() {
    const items = [];
    let status = 'info';
    const { requests } = this.props;
    forEach(requests, req => {
      if (
        status === 'info' &&
        (req.status === 'Processing' || req.status === 'Pending')
      ) {
        status = 'warning';
      } else if (req.status === 'Timeout') {
        status = 'danger';
      }

      let startTime = moment(req.stamp);
      let duration;
      if (startTime) {
        duration = moment
          .duration(moment(req.endStamp).diff(startTime))
          .as('milliseconds');
        startTime = startTime.fromNow();
      }

      items.push(
        <div key={req.requestId} className="material-notification">
          <header className="material-notification__header">
            <DashboardIcon className="material-notification__header-icon material-icons mdl-color-text--primary" />
            <span className="material-notification__header-title mdl-color-text--primary">
              API Request
            </span>
            <span className="material-notification__header-optional">
              {startTime}
            </span>
            {duration && (
              <span className="material-notification__header-optional">
                {duration} ms
              </span>
            )}
          </header>
          <div className="material-notification__content">
            <p className="material-notification__content-text">{req.status}</p>
            <p className="material-notification__content-text">{req.name}</p>
          </div>
          {(req.status === 'Processing' || req.status === 'Pending') && (
            <footer className="material-notification__footer">
              <button className="mdl-button mdl-js-button mdl-button--primary">
                Cancel
              </button>
            </footer>
          )}
        </div>
      );
    });
    items.reverse();
    return { items, status };
  }

  render() {
    const { requests } = this.props;
    const { items, status } = this.renderItems();
    const count = Object.keys(requests).length;

    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} inNavbar>
        <DropdownToggle
          tag="span"
          onClick={this.toggle}
          data-toggle="dropdown"
          aria-expanded={this.state.dropdownOpen}
        >
          <NotificationsIcon />
          {count > 0 && (
            <span className={`badge badge-pill badge-${status} up`}>
              {count}
            </span>
          )}
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-media">{items}</DropdownMenu>
      </Dropdown>
    );
  }
}

function mapStateToProps(state) {
  return {
    requests: state.queue.api
  };
}

export default connect(mapStateToProps)(RequestQueue);
