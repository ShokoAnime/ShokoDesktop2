import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { forEach } from 'lodash';
import Actions from '../core/actions/queue';

import './NotificationsQueue.global.css';

class NotificationsQueue extends Component {
  static propTypes = {
    notifications: PropTypes.objectOf(
      PropTypes.shape({
        id: PropTypes.string,
        status: PropTypes.string
      })
    ).isRequired,
    cancel: PropTypes.func.isRequired
  };

  renderItems() {
    const items = [];
    const { notifications, cancel } = this.props;
    forEach(notifications, req => {
      const { type, message } = req.data;
      items.push(
        <div key={req.id} className={`toast toast-just-text toast-${type}`}>
          <button
            type="button"
            className="toast-close-button"
            aria-label="Close"
            onClick={() => {
              cancel(req.id);
            }}
          >
            <span aria-hidden="true">×</span>
          </button>
          <div className="toast-message">Messages</div>
          <div className="toast-message">{message}</div>
        </div>
      );
    });
    items.reverse();
    return items;
  }

  render() {
    const { notifications } = this.props;
    const items = this.renderItems();
    const count = Object.keys(notifications).length;

    if (count === 0) {
      return null;
    }
    return (
      <div
        id="toast-top-right"
        className="toast-top-right"
        aria-live="polite"
        role="alert"
      >
        {items}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    notifications: state.queue.notifications
  };
}

function mapDispatchToProps(dispatch) {
  return {
    cancel: id => dispatch(Actions.notificationsQueueRemove(id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationsQueue);
