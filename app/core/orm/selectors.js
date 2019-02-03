// selectors.js
import { createSelector } from 'redux-orm';
import orm from './orm';

const ormSelector = state => state.orm;

export const groupsSelector = createSelector(orm, ormSelector, session =>
  session.Group.all().toModelArray()
);

const seriesByGroupSelector = groupId =>
  createSelector(orm, ormSelector, session =>
    session.Group.withId(groupId).series.toRefArray()
  );

const groupByIdSelector = groupId =>
  createSelector(
    orm,
    ormSelector,
    session => session.Group.withId(groupId).ref
  );

const groupFiltersSelector = createSelector(orm, ormSelector, session =>
  session.GroupFilter.all()
    .filter({ parent: 0 })
    .toModelArray()
);

const getFilter = filterId =>
  createSelector(
    orm,
    ormSelector,
    session => session.GroupFilter.withId(filterId).ref
  );

const groupsByFilterSelector = filterId =>
  createSelector(orm, ormSelector, session =>
    session.GroupFilter.withId(filterId).groups.toRefArray()
  );

const filtersByParentSelector = parent =>
  createSelector(orm, ormSelector, session =>
    session.GroupFilter.filter({ parent })
      .all()
      .toRefArray()
  );

const recentFiles = createSelector(orm, ormSelector, session => {
  const files = session.RecentFile.all().toModelArray();

  files.sort((a, b) => {
    if (a.time === b.time) {
      return 0;
    }
    return a.time > b.time ? 1 : -1;
  });
  return files;
});

const recentSeries = createSelector(orm, ormSelector, session =>
  session.SeriesRecent.all().toModelArray()
);

const seriesCalendar = createSelector(orm, ormSelector, session =>
  session.SeriesCalendar.all().toModelArray()
);

export default {
  allGroups: groupsSelector,
  seriesByGroup: seriesByGroupSelector,
  groupById: groupByIdSelector,
  allGroupFilters: groupFiltersSelector,
  groupsByFilter: groupsByFilterSelector,
  filtersByParent: filtersByParentSelector,
  filterById: getFilter,
  recentFiles,
  recentSeries,
  seriesCalendar
};
