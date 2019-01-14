import { channel, delay } from 'redux-saga';
import { take, fork, call, put } from 'redux-saga/effects';
import { v1 as uuid } from 'uuid';
import Actions from '../../actions/queue';

function* watchRequests() {
  // create a channel to queue incoming requests
  const chan = yield call(channel);
  const workerThreads = 2;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < workerThreads; i++) {
    yield fork(handleRequest, chan);
  }

  while (true) {
    const { payload } = yield take('NOTIFICATION');
    yield put(chan, payload);
  }
}

export function* queueRequest(data, cancel) {
  const notificationId = uuid();
  if (cancel === true) {
    yield put(Actions.notificationsQueueRemove(data));
    return;
  }
  yield put({ type: 'NOTIFICATION', payload: { id: notificationId, data } });
  return notificationId;
}

function* handleRequest(chan) {
  while (true) {
    let id = null;
    let remove = false;
    try {
      const payload = yield take(chan);
      // eslint-disable-next-line prefer-destructuring
      id = payload.id;
      yield put(Actions.notificationsQueueAdd({ id, data: payload.data }));

      if (payload.data.timeout > 0) {
        remove = true;
        yield delay(payload.data.timeout);
      }
    } finally {
      if (id !== null && remove === true) {
        yield put(Actions.notificationsQueueRemove(id));
      }
    }
  }
}

export default watchRequests;
