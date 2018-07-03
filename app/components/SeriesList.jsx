import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Collection, AutoSizer } from 'react-virtualized';
import { connect } from 'react-redux';

import './Groups.global.css';
import SiteMenuBar from './SiteMenuBar';
import SiteNavbar from './SiteNavbar';
import Events from '../events/index';
import Group from './groups/Group';

class SeriesList extends Component {
  static propTypes = {
    groups: PropTypes.array,
    getSeries: PropTypes.func,
  };

  componentDidMount() {
    const { getSeries } = this.props;
    getSeries();
  }

  cellRenderer = ({index, key, style}) => {
    const group = this.props.groups[index];
    if (group === undefined) { return undefined; }
    return <div key={key} style={style}><Group key={group.id} group={group} /></div>
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
      x: ((index+1)%6)*cellWidth,
      y: row*cellHeight
    }
  }

  render() {
    const { groups } = this.props;

    return (
      <div style={{ height: '100vh', position: 'relative' }}>
        <SiteNavbar />
        <SiteMenuBar />
        <div className="page page-groups">
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
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getSeries: () => { dispatch({ type: Events.GET_SERIES }); },
  };
}

function mapStateToProps(state) {
  const { groups } = state;

  return {
    groups,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SeriesList);
