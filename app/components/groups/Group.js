import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'react-tooltip';
import { forEach } from 'lodash';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import SeriesImage from '../SeriesImage';
import AnidbDescription from '../AnidbDescription';

class Group extends PureComponent {
  static propTypes = {
    isGroup: PropTypes.bool,
    group: PropTypes.object,
    openSeries: PropTypes.func.isRequired,
    openGroup: PropTypes.func.isRequired
  };

  static defaultProps = {
    isGroup: true,
    group: {}
  };

  render() {
    const { group, openSeries, isGroup, openGroup } = this.props;
    const groupId = `group${group.id}`;

    let unwatched;
    try {
      unwatched = group.local_sizes.Episodes - group.watched_sizes.Episodes;
    } catch (e) {
      unwatched = 0;
    }

    const tags = [];
    forEach(group.tags, tag => {
      // if (tags.length > 8) { return false; }
      tags.push(
        <span key={tag} className="badge badge-pill">
          {tag}
        </span>
      );
    });

    return (
      <div
        className="group"
        data-tip
        data-for={groupId}
        data-delay-show="500"
        onClick={() => {
          if (isGroup) {
            openGroup(group.id);
          } else {
            openSeries(group.id);
          }
        }}
      >
        <SeriesImage poster first art={group.art} />
        {unwatched > 0 && <div className="unwatched">{unwatched}</div>}
        <div className="title">
          <div>
            <p>{group.name}</p>
          </div>
        </div>
        <Tooltip id={groupId} effect="solid" place="right">
          <div className="group-tooltip">
            <SeriesImage banner first art={group.art} />
            <div>
              <span>
                <i className="icon icon-air" />
                {group.air}
              </span>
              <span>
                <i className="icon icon-episodes" />
                {group.local_sizes && group.local_sizes.Episodes}
              </span>
              <span>
                <i className="icon icon-rating" />
                {group.rating}
              </span>
            </div>
            <div className="tooltip-title">{group.name}</div>
            <div className="tooltip-description">
              <AnidbDescription text={group.summary} />
            </div>
            <div className="tooltip-tags">{tags}</div>
          </div>
        </Tooltip>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    openSeries: id => {
      dispatch(push(`/series/${id}`));
    },
    openGroup: id => {
      dispatch(push(`/groups/${id}`));
    }
  };
}

function mapStateToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Group);
