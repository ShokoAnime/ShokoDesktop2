import { delay } from 'redux-saga';
import {
  take,
  fork,
  call,
  put,
  select,
  race,
  actionChannel
} from 'redux-saga/effects';
import Base62 from 'base62';
import Actions from '../actions/queue';

let counter = 0;

function reqId() {
  counter += 1;
  const id = Base62.encode(Date.now() + 1000 + counter);
  return `api-request-${id}`;
}

function* watchRequests() {
  const workerThreads = 1;

  for (let i = 0; i < workerThreads; i += 1) {
    yield fork(handleRequest);
  }
}

export function* queueRequest(endpoint, data) {
  const requestId = reqId();
  yield put(
    Actions.apiQueueAdd({
      requestId,
      name: endpoint.name,
      stamp: new Date(),
      status: 'Pending'
    })
  );
  yield put({ type: 'API_REQUEST', payload: { requestId, endpoint, data } });
  return requestId;
}

function* handleRequest() {
  const requestChannel = yield actionChannel('API_REQUEST');
  while (true) {
    const { payload } = yield take(requestChannel);
    const { requestId, endpoint, data } = payload;

    yield put(Actions.apiQueueUpdate({ requestId, status: 'Processing' }));
    const apiState = yield select(state => state.api);

    const { response } = yield race({
      response: call(endpoint, apiState, data),
      timeout: call(delay, 5000)
    });

    // process the request
    yield put({ type: 'REQUEST_PROCESSED', requestId });

    if (response) {
      yield put(
        Actions.apiQueueUpdate({
          requestId,
          endStamp: new Date(),
          status: 'Success'
        })
      );
      yield put({ type: `API_RESPONSE_${requestId}`, payload: response });
    } else {
      yield put(
        Actions.apiQueueUpdate({
          requestId,
          endStamp: new Date(),
          status: 'Timeout'
        })
      );
      yield put({
        type: `API_RESPONSE_${requestId}`,
        payload: { error: true, message: 'Operation timed out' }
      });
    }
  }
}

export default watchRequests;
