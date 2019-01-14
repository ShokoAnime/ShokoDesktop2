import {
  put,
  takeEvery,
  call,
  select,
  fork,
  all,
  take
} from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { forceCheck } from 'react-lazyload';
import { remote } from 'electron';

import Events from '../../events';
import Api from './api';
import { series } from '../../core/actions/series';
import { api } from '../../core/actions/api';
import { creators as orm } from '../../core/actions/orm';
import uiActions from '../../core/actions/ui';
import dashboardActions from '../../core/actions/dashboard';
import watchRequests, { queueRequest } from './ApiRequestQueue';
import notificationsWatcher, {
  queueRequest as queueNotification
} from './NotificationsQueue';

function* Login() {
  const apiState = yield select(state => state.api);
  const data = {
    user: apiState.user,
    pass: apiState.password,
    device: 'shoko-v2'
  };

  const reqId = yield queueRequest(Api.postLogin, data);

  const result = yield take(`API_RESPONSE_${reqId}`);
  const resultJson = result.payload;
  if (resultJson.error) {
    yield queueNotification({ type: 'error', message: resultJson.message });
    return;
  }

  yield put(api({ key: resultJson.data.apikey }));
  yield put(push({ pathname: '/dashboard' }));
}

function* LoginImage() {
  const apiState = yield select(state => state.api);
  const result = yield call(Api.getRandomImage, apiState);
  if (result.error) {
    return;
  }

  const blob = yield result.blob();
  yield put(uiActions.setUi({ loginImage: URL.createObjectURL(blob) }));
}

function* apiSetValue(action) {
  const { payload } = action;

  yield put(api({ [payload.field]: payload.value }));
}

function* getGroups() {
  const reqId = yield queueRequest(Api.getGroups);

  const result = yield take(`API_RESPONSE_${reqId}`);
  const resultJson = result.payload;
  if (resultJson.error) {
    alert(resultJson.message);
  } else {
    yield put(orm.fetchFullGroupList(resultJson.data));
  }
}

function* getGroupFilters(action) {
  const reqId = yield queueRequest(Api.getGroupFilters, action.payload);

  const result = yield take(`API_RESPONSE_${reqId}`);
  const resultJson = result.payload;
  if (resultJson.error) {
    alert(resultJson.message);
  } else {
    resultJson.data.parent = action.payload;
    yield put(orm.loadGroupFiltersList(resultJson.data));
    if (resultJson.data.type !== 'filters') {
      // It is a group so hide the filter
      yield put(uiActions.setUi({ groupFilter: false }));
      forceCheck();
    }
  }
}

function* getSeries(action) {
  const apiState = yield select(state => state.api);

  const resultJson = yield call(Api.getSeries, apiState, action.payload);
  if (resultJson.error) {
    alert(resultJson.message);
  } else {
    yield put(series(resultJson.data));
  }
}

function* Exit() {
  window.close();
  yield null;
}

function* windowMaximize() {
  const window = remote.BrowserWindow.getFocusedWindow();

  if (window.isMaximized()) {
    window.unmaximize();
  } else {
    window.maximize();
  }
  yield null;
}

function* windowMinimize() {
  remote.BrowserWindow.getFocusedWindow().minimize();
  yield null;
}

function* getDashboard() {
  const reqId = yield queueRequest(Api.getDashboard);
  const result = yield take(`API_RESPONSE_${reqId}`);
  const resultJson = result.payload;
  if (resultJson.error) {
    yield queueNotification({ type: 'error', message: resultJson.message });
  } else {
    // eslint-disable-next-line import/no-named-as-default-member
    yield put(dashboardActions.getDashboard(resultJson.data));
  }
}

function* getFileRecent() {
  const reqId = yield queueRequest(Api.getFileRecent);
  const result = yield take(`API_RESPONSE_${reqId}`);
  const resultJson = result.payload;
  if (resultJson.error) {
    yield queueNotification({ type: 'error', message: resultJson.message });
  } else {
    yield put(orm.loadRecentFiles(resultJson.data));
  }
}

function* openExternal(action) {
  const { payload } = action;
  // eslint-disable-next-line global-require
  require('electron').shell.openExternal(payload);
  yield null;
}

function* getSeriesRecent() {
  const reqId = yield queueRequest(Api.getSeriesRecent);
  const result = yield take(`API_RESPONSE_${reqId}`);
  const resultJson = result.payload;
  if (resultJson.error) {
    yield queueNotification({ type: 'error', message: resultJson.message });
  } else {
    yield put(orm.loadSeriesRecent(resultJson.data));
  }
}

function* getSeriesCalendar() {
  const reqId = yield queueRequest(Api.getSeriesCalendar);
  const result = yield take(`API_RESPONSE_${reqId}`);
  const resultJson = result.payload;
  if (resultJson.error) {
    yield queueNotification({ type: 'error', message: resultJson.message });
  } else {
    yield put(orm.loadSeriesCalendar(resultJson.data));
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(Events.GET_GROUPS, getGroups),
    takeEvery(Events.GET_GROUP_FILTERS, getGroupFilters),
    takeEvery(Events.GET_SERIES, getSeries),
    takeEvery(Events.LOGIN, Login),
    takeEvery(Events.LOGIN_IMAGE, LoginImage),
    takeEvery(Events.API_SET_VALUE, apiSetValue),
    takeEvery(Events.EXIT, Exit),
    takeEvery(Events.WINDOW_MAXIMIZE, windowMaximize),
    takeEvery(Events.WINDOW_MINIMIZE, windowMinimize),
    takeEvery(Events.GET_DASHBOARD, getDashboard),
    takeEvery(Events.GET_FILE_RECENT, getFileRecent),
    takeEvery(Events.OPEN_EXTERNAL, openExternal),
    takeEvery(Events.GET_SERIES_RECENT, getSeriesRecent),
    takeEvery(Events.GET_SERIES_CALENDAR, getSeriesCalendar),
    fork(watchRequests),
    fork(notificationsWatcher)
  ]);
}
