// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware, routerActions } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import Store from 'electron-store';

import throttle from 'lodash/throttle';
import rootReducer from '../reducers';
import rootSaga from '../sagas';
import { saveState, loadState } from './localStorage';

const history = createHashHistory();
const sagaMiddleware = createSagaMiddleware();

const configureStore = initialState => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Thunk Middleware
  middleware.push(thunk);

  // Saga Middleware
  middleware.push(sagaMiddleware);

  // Skip redux logs in console during the tests
  if (process.env.NODE_ENV !== 'test') {
    // middleware.push(logger);
  }

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  // Redux DevTools Configuration
  const actionCreators = {
    ...routerActions
  };
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
        actionCreators
      })
    : compose;
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  const state = Object.assign({}, initialState, loadState());
  // Create Store
  const store = createStore(rootReducer, state, enhancer);

  const settingsStore = new Store();
  let previousState;
  // Save store to local storage
  store.subscribe(
    throttle(() => {
      const apiState = store.getState().api;
      saveState({
        api: apiState
      });
      if (previousState !== apiState) {
        settingsStore.set('api.host', apiState.host);
      }
      previousState = apiState;
    }, 1000)
  );

  // Run saga
  sagaMiddleware.run(rootSaga);

  if (module.hot) {
    module.hot.accept(
      '../reducers',
      () => store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    );
  }

  return store;
};

export default { configureStore, history };
