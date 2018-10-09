// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import pretty from 'prettysize';
import PropTypes from 'prop-types';
import './Dashboard.global.css';
import Events from '../../events';
import selectors from '../../orm/selectors';
import { ReactComponent as SuccessIcon } from '../../icons/svg/successFilled.svg';
import { ReactComponent as WarningIcon } from '../../icons/svg/warningFilled.svg';
import { ReactComponent as PlayIcon } from '../../icons/svg/playFilled.svg';
import { ReactComponent as CollectionIcon } from '../../icons/svg/collection.svg';

class TabPanel extends Component {
  static propTypes = {
    files: PropTypes.arrayOf(
      PropTypes.shape({
        size: PropTypes.number,
        id: PropTypes.number,
        filename: PropTypes.string,
        created: PropTypes.string,
        updated: PropTypes.string,
        recognized: PropTypes.bool,
        type: PropTypes.string,
        url: PropTypes.string,
      })
    ),
    series: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      })
    ),
    getFileRecent: PropTypes.func.isRequired,
    openExternal: PropTypes.func.isRequired,
    getSeriesRecent: PropTypes.func.isRequired,
  };

  static defaultProps = {
    files: [],
    series: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  setTab = (id) => {
    this.setState({activeTab: id}, this.fetchData);
  }

  fetchData = () => {
    const { activeTab } = this.state;
    switch (activeTab){
      case 1:
        this.props.getFileRecent();
        break;
      case 2:
        this.props.getSeriesRecent();
        break;
      default:
        break;
    }
  }

  renderLatest = () => {
    const { files, openExternal } = this.props;

    return (
      <table className="table">
        <thead />
        <tbody>
          {files &&
          files.map(file => (
            <tr key={file.id}>
              <td className="name"><div>{file.filename}</div></td>
              <td>{pretty(file.size)}</td>
              <td>{file.recognized === true ? <SuccessIcon className="dashboard-icon icon-green" /> : <WarningIcon className="dashboard-icon icon-yellow" />}</td>
              <td>{file.recognized === true && <PlayIcon onClick={() => { openExternal(file.url); }} className="dashboard-icon icon-blue" />}</td>
              <td>{file.recognized === true && <CollectionIcon className="dashboard-icon icon-blue" />}</td>
            </tr>
            )
          )}
        </tbody>
      </table>
    );
  }

  renderSeries = () => {
    const { series } = this.props;

    return (
      <table className="table">
        <thead />
        <tbody>
          {series &&
          series.map(item => (
            <tr>
              <td className="name"><div>{item.name}</div></td>
            </tr>
            )
          )}
        </tbody>
      </table>
    );
  }

  render() {
    const { activeTab } = this.state;
    return (
      <div className="panel panel-dark dashboard-panel tab-panel">
        <div className="panel-heading">
          <h3 onClick={() => { this.setTab(1); }} className={`panel-title ${activeTab === 1?'active':''}`}>Latest items</h3>
          <h3 onClick={() => { this.setTab(2); }} className={`panel-title ${activeTab === 2?'active':''}`}>Latest series</h3>
          <h3 className="panel-title">Action items</h3>
        </div>
        <div className="panel-body">
          {activeTab === 1 && this.renderLatest()}
          {activeTab === 2 && this.renderSeries()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    files: selectors.recentFiles(state),
    series: selectors.recentSeries(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getFileRecent: () => {
      dispatch({ type: Events.GET_FILE_RECENT });
    },
    getSeriesRecent: () => {
      dispatch({ type: Events.GET_SERIES_RECENT });
    },
    openExternal: (value) => {
      dispatch({ type: Events.OPEN_EXTERNAL, payload: value });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TabPanel);
