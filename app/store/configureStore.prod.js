// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'react-router-redux';
import throttle from 'lodash/throttle';
import Store from 'electron-store';

import rootReducer from '../reducers';
import rootSaga from '../sagas';
import { saveState, loadState } from './localStorage';

const sagaMiddleware = createSagaMiddleware();
const history = createHashHistory();
const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, sagaMiddleware, router);

function configureStore(initialState) {
  const state = Object.assign({}, initialState, loadState());
  const store = createStore(rootReducer, state, enhancer);

  const settingsStore = new Store();
  let previousState;
  // Save store to local storage
  store.subscribe(
    throttle(() => {
      const apiState = store.getState().api;
      previousState = apiState;
      saveState({
        api: apiState
      });
      if (previousState !== apiState) {
        settingsStore.set('api.host', apiState.host);
      }
    }, 1000)
  );

  // Run saga
  sagaMiddleware.run(rootSaga);

  return store;
}

export default { configureStore, history };
