import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Collection, AutoSizer } from 'react-virtualized';
import { connect } from 'react-redux';

import selectors from '../../core/orm/selectors';
import '../Groups.global.css';
import Events from '../../core/events/index';
import Group from './Group';
import Panel from './Panel';
import Filters from './Filters';

class Groups extends Component {
  static propTypes = {
    groups: PropTypes.array,
    getGroups: PropTypes.func,
    filter: PropTypes.string,
    isGroup: PropTypes.bool,
    filterId: PropTypes.number,
  };

  static defaultProps = {
    filterId: 0,
  };

  componentDidMount() {
    const { getGroups, groups } = this.props;
    if (groups.length === 0) getGroups();
  }

  cellRenderer = ({index, key, style}) => {
    const { groups } = this.props;
    const group = groups[index];
    if (group === undefined) { return undefined; }
    if (group.series && group.series.count() === 1) {
      const series = group.series.first();
      return <div key={key} style={style}><Group isGroup={false} key={series.id} group={series} /></div>
    }
    return <div key={key} style={style}><Group isGroup={group.type === 'group'} key={group.id} group={group} /></div>
  }

  cellSizeAndPositionGetter = ({index}) => {
    const cellWidth = 200;
    const cellPerRow = 6;
    const cellHeight = 250;

    const rowWidth = cellWidth*cellPerRow;
    const row = Math.floor(index*cellWidth/rowWidth);

    return {
      height: cellHeight,
      width: cellWidth,
      x: ((index) % cellPerRow) * cellWidth,
      y: row*cellHeight
    }
  }

  render() {
    const { groups, filter, filterId } = this.props;

    console.log(filterId, groups);
    return (
      <div className="page page-groups">
        <Filters filter={filterId} />
        <Panel title={filter}>
          <div className="groups-container">
            <AutoSizer>
              {({width, height}) => (
                <Collection
                  cellCount={groups.length}
                  cellRenderer={this.cellRenderer}
                  cellSizeAndPositionGetter={this.cellSizeAndPositionGetter}
                  height={height}
                  horizontalOverscanSize={0}
                  verticalOverscanSize={0}
                  width={width}
                />
              )}
            </AutoSizer>
          </div>
        </Panel>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getGroups: () => { dispatch({ type: Events.GET_GROUPS }); },
  };
}

function mapStateToProps(state, ownProps) {
  let groupId;
  let filterId;
  let group;
  try {
    groupId = ownProps.match.params.id;
  } catch (ex) {
    groupId = undefined;
  }
  try {
    filterId = parseInt(ownProps.match.params.filterId,10);
  } catch (ex) {
    filterId = undefined;
  }

  if (groupId) {
    group = selectors.groupById(groupId)(state);
  }
  let filteredGroups;
  let filter;
  if (filterId) {
    filter = selectors.filterById(filterId)(state);
    filteredGroups = selectors.groupsByFilter(filterId)(state);
    if (filteredGroups.length === 0) { filteredGroups = undefined; }
  }

  return {
    groups: filteredGroups ? filteredGroups : (groupId ? selectors.seriesByGroup(groupId)(state) : selectors.allGroups(state)),
    isGroup: groupId === undefined,
    filter: filteredGroups ? filter.name : (groupId ? group.name : 'All groups'),
    filterId: filterId || 0,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
