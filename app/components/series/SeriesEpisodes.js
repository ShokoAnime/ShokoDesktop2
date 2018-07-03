import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { forEach } from 'lodash';
import '../Series.global.css';
import SeriesImage from '../SeriesImage';
import FilterDropdown from './FilterDropdown';

class SeriesEpisodes extends Component {
  static propTypes = {
    series: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.typeChange = this.typeChange.bind(this);
    this.state = {
      type: 'Episode'
    };
  }

  typeChange(option) {
    this.setState({ type: option.key });
  }

  render() {
    const { series } = this.props;
    const { type } = this.state;

    const items = [];
    forEach(series.eps, episode => {
      if (episode.eptype !== type) {
        return;
      }
      items.push(
        <div className="episode">
          <SeriesImage poster first art={episode.art} />
          <div>
            <p className="title">{episode.name}</p>
            <p>
              Episode {episode.epnumber} | {episode.air} | xx Minutes |{' '}
              {episode.rating} ({episode.votes} votes)
            </p>
            <ul className="nav nav-tabs nav-tabs-line">
              <li className="nav-item">
                <a className="nav-link active">Description</a>
              </li>
              <li className="nav-item">
                <a className="nav-link">File info</a>
              </li>
              <li className="nav-item">
                <a className="nav-link">Hashes</a>
              </li>
            </ul>
            <p>{episode.summary}</p>
          </div>
        </div>
      );
    });

    const typeFilters = [
      { key: 'Episode', value: 'Episodes' },
      { key: 'Credits', value: 'Credits' }
    ];

    return (
      <div className="series-episodes">
        <div className="panel panel-dark">
          <div className="panel-heading">
            <h3 className="panel-title">Episodes</h3>
          </div>
          <div className="panel-body">
            <div className="filters-toolbar">
              <FilterDropdown
                options={typeFilters}
                onSelect={this.typeChange}
              />
            </div>
            {items}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { api, series } = state;

  return {
    api,
    series
  };
}

export default connect(mapStateToProps)(SeriesEpisodes);
