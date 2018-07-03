// @flow
import React, { Component } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';
import { forEach } from 'lodash';
import { Route } from 'react-router';
import PropTypes from 'prop-types';

import './Series.global.css';
import Events from '../events';
import calendarIcon from '../icons/16-Calender-Active.png';
import collectionIcon from '../icons/16-Collection-Active.png';
import starIcon from '../icons/16-My-Lists-Active.png';
import SeriesImage from './SeriesImage';
import SeriesInfo from './series/SeriesInfo';
import SeriesEpisodes from './series/SeriesEpisodes';
import RoutedTabpanel from './series/RoutedTabpanel';

class Series extends Component {
  static seriesTabpanel() {
    return [
      { title: 'Series info', route: '' },
      { title: 'Episodes info', route: '/episodes' },
      { title: 'Characters', route: '/characters' },
      { title: 'Images', route: '/images' },
      { title: 'Related & Similar', route: '/related' },
      { title: 'Reviews', route: '/reviews' },
      { title: 'Files', route: '/files' }
    ];
  }

  static propTypes = {
    getSeries: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    series: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { match, getSeries } = this.props;
    getSeries(match.params.id);
  }

  render() {
    const { series, match } = this.props;
    const tags = [];
    const episodes = {
      totalEpisodes: (series.total_sizes && series.total_sizes.Episodes) || 0,
      totalSpecials: (series.total_sizes && series.total_sizes.Specials) || 0,
      localEpisodes: (series.total_sizes && series.local_sizes.Episodes) || 0,
      localSpecials: (series.total_sizes && series.local_sizes.Specials) || 0,
      watchedEpisodes:
        (series.watched_sizes && series.watched_sizes.Episodes) || 0,
      watchedSpecials:
        (series.watched_sizes && series.watched_sizes.Specials) || 0
    };

    forEach(series.tags, tag => {
      tags.push(<div className="badge badge-info">{tag}</div>);
    });

    return (
      <div className="page page-series">
        <PerfectScrollbar>
          <div className="banner">
            <SeriesImage banner first art={series.art} />
          </div>
          <div className="series-title">
            <span className="title">{series.name}</span>
            <span className="type">{series.type}</span>
          </div>
          <div className="series-info">
            <img src={calendarIcon} alt="" />
            <span>{series.air}</span>
            <img src={collectionIcon} alt="" />
            <span>
              {episodes.totalEpisodes} Episodes{' '}
              {series.total_sizes &&
                series.total_sizes.Specials &&
                `(${series.total_sizes.Specials} Specials)`}
            </span>
            <img src={starIcon} alt="" />
            <span>
              {series.rating} ({series.votes} votes)
            </span>
          </div>
          <div className="poster">
            <SeriesImage poster first art={series.art} />
          </div>
          <div className="series-stats">
            <div className="toolbar">
              <i className="icon icon-edit-blue" />
              <i className="icon icon-tag-blue" />
              <i className="icon icon-add-list" />
              <i className="icon icon-add-playlist" />
              <i className="icon icon-pinned" />
            </div>
            <p className="section">
              <i className="icon icon-watch" />watch count
            </p>
            <p>
              {episodes.watchedEpisodes} / {episodes.totalEpisodes} Episodes
            </p>
            <p>
              {episodes.watchedSpecials} / {episodes.totalSpecials} Specials
            </p>
            <p className="section">
              <i className="icon icon-file" />file count
            </p>
            <p>0 Missing (Collecting)</p>
            <p>
              {episodes.totalEpisodes +
                episodes.totalSpecials -
                (episodes.localEpisodes + episodes.localSpecials) || 0}{' '}
              Missing (Total)
            </p>
            <p className="section">
              <i className="icon icon-rating" />user rating
            </p>
            <p>{series.userrating || 'N/A (No rating)'}</p>
            <p className="section">
              <i className="icon icon-user" />user activity
            </p>
            <p>Last watched: ...</p>
            <p>Episode: </p>
            <p className="section">
              <i className="icon icon-link" />links
            </p>
          </div>
          <div className="series-nav">
            <ol className="breadcrumb breadcrumb-series">
              <li className="breadcrumb-item">Collection</li>
              <li className="breadcrumb-item">Very Long Series</li>
              <li className="breadcrumb-item active">Fairy Tail</li>
              <li className="breadcrumb-item active">Fairy Tail (2014)</li>
            </ol>
            <RoutedTabpanel
              route={match.url}
              config={Series.seriesTabpanel()}
            />
          </div>
          <div className="series-content">
            <Route path={match.url} exact component={SeriesInfo} />
            <Route
              path={`${match.url}/episodes`}
              exact
              component={SeriesEpisodes}
            />
          </div>
        </PerfectScrollbar>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getSeries: id => {
      dispatch({ type: Events.GET_SERIES, payload: id });
    }
  };
}

function mapStateToProps(state) {
  const { api, series } = state;

  return {
    api,
    series
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Series);
