import { forEach } from 'lodash';
import orm from '../orm/orm';
import Actions from '../actions/orm';

export default function ormReducer(dbState, action) {
  const session = orm.session(dbState);

  // Session-specific Models are available
  // as properties on the Session instance.
  const {
    Group,
    Series,
    GroupFilter,
    RecentFile,
    SeriesRecent,
    SeriesCalendar
  } = session;

  switch (action.type) {
    case Actions.FETCH_FULL_GROUP_LIST:
      forEach(action.payload, list => {
        const group = list;
        const seriesIds = [];
        forEach(group.series, item => {
          Series.upsert(item);
          seriesIds.push(item.id);
        });
        group.series = seriesIds;
        Group.upsert(group);
      });
      break;
    case Actions.LOAD_GROUP_FILTERS_LIST:
      if (action.payload.type === 'filters') {
        forEach(action.payload.filters, item => {
          GroupFilter.upsert(
            Object.assign({}, item, {
              parent: action.payload.parent || 0,
              groups: (item.groups && item.groups.map(g => g.id)) || []
            })
          );
        });
      } else {
        const item = action.payload;
        GroupFilter.upsert(
          Object.assign({}, item, { groups: item.groups.map(g => g.id) })
        );
      }
      break;
    case Actions.LOAD_RECENT_FILES:
      forEach(action.payload, file => {
        RecentFile.upsert(file);
      });
      break;
    case Actions.LOAD_SERIES_RECENT:
      forEach(action.payload, item => {
        SeriesRecent.upsert(item);
      });
      break;
    case Actions.LOAD_SERIES_CALENDAR:
      forEach(action.payload.series, item => {
        SeriesCalendar.upsert(item);
      });
      break;
    default:
      break;
  }

  // the state property of Session always points to the current database.
  // Updates don't mutate the original state, so this reference is not
  // equal to `dbState` that was an argument to this reducer.
  return session.state;
}
