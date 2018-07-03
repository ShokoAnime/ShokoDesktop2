import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { forEach } from 'lodash';

import '../Series.global.css';
import AnidbDescription from '../AnidbDescription';

class Series extends Component {
  static propTypes = {
    series: PropTypes.object.isRequired
  };

  render() {
    const { series } = this.props;
    const tags = [];
    forEach(series.tags, tag => {
      tags.push(<div className="badge badge-info">{tag}</div>);
    });

    return (
      <div className="panel panel-dark">
        <div className="panel-heading">
          <h3 className="panel-title">Series synopsis</h3>
        </div>
        <div className="panel-body">
          <ul className="nav nav-tabs nav-tabs-line">
            <li className="nav-item">
              <a className="nav-link active">AniDB</a>
            </li>
            <li className="nav-item">
              <a className="nav-link">TvDB</a>
            </li>
            <li className="nav-item">
              <a className="nav-link">MAL</a>
            </li>
          </ul>
          {series.summary ? <AnidbDescription text={series.summary} /> : null}
          <div className="tags">{tags}</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { series } = state;

  return {
    series
  };
}

export default connect(mapStateToProps)(Series);
