import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { forEach } from 'lodash';
import { Link } from 'react-router-dom';

import '../Series.global.css';

class RoutedTabpanel extends Component {
  static propTypes = {
    config: PropTypes.arrayOf(
      PropTypes.shape({
        route: PropTypes.string,
        title: PropTypes.string
      })
    ).isRequired,
    route: PropTypes.string,
    location: PropTypes.shape({
      pathname: PropTypes.string
    }).isRequired
  };

  static defaultProps = {
    route: ''
  };

  render() {
    const { route, config, location } = this.props;
    const tabs = [];
    forEach(config, item => {
      const classes = ['nav-link'];
      if (`${route}${item.route}` === location.pathname) {
        classes.push('active');
      }
      tabs.push(
        <li className="nav-item">
          <Link className={classes.join(' ')} to={`${route}${item.route}`}>
            {item.title}
          </Link>
        </li>
      );
    });

    return <ul className="nav nav-tabs nav-tabs-line">{tabs}</ul>;
  }
}

function mapStateToProps(state) {
  return {
    location: state.router.location
  };
}

export default connect(mapStateToProps)(RoutedTabpanel);
