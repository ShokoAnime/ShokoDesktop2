// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'react-router-redux';
import throttle from 'lodash/throttle';
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

  // Save store to local storage
  store.subscribe(
    throttle(() => {
      saveState({
        api: store.getState().api
      });
    }, 1000)
  );

  // Run saga
  sagaMiddleware.run(rootSaga);

  return store;
}

export default { configureStore, history };
