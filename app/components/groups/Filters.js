import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import selectors from '../../core/orm/selectors';
import Events from '../../core/events';

class Panel extends PureComponent {
  static propTypes = {
    filters: PropTypes.array,
    filter: PropTypes.number,
    getFilters: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired
  };

  static defaultProps = {
    filters: [],
    filter: 0
  };

  componentDidMount() {
    this.fetchFilters();
  }

  componentDidUpdate(prevProps) {
    const { filter } = this.props;
    if (prevProps.filter === filter) {
      return;
    }
    this.fetchFilters();
  }

  fetchFilters = () => {
    const { getFilters, filter } = this.props;
    getFilters(filter > 0 ? filter : undefined);
  };

  render() {
    const { filters, visible } = this.props;
    return (
      <div
        className={`group-filters-panel ${visible === false ? 'closed' : ''}`}
      >
        {filters.map(filter => (
          <Link to={`/groups/filter/${filter.id}`} key={filter.id}>
            {filter.name} ({filter.size})
          </Link>
        ))}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getFilters: filter => {
      dispatch({ type: Events.GET_GROUP_FILTERS, payload: filter });
    }
  };
}

function mapStateToProps(state, ownProps) {
  const filterId = ownProps.filter;
  let filters;
  try {
    filters =
      filterId > 0
        ? selectors.filtersByParent(filterId)(state)
        : selectors.allGroupFilters(state);
  } catch (ex) {
    filters = [];
  }
  return {
    filters,
    visible: state.ui.groupFilter
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Panel);
