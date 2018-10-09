import { handleAction } from 'redux-actions';
import Store from 'electron-store';

import { API } from '../actions/api';

const store = new Store();

const defaultState = {
  user: '',
  password: '',
  key: '',
  host: store.get('api.host', 'http://127.0.0.1:8111')
};

const api = handleAction(
  API,
  (state, action) => {
    if (action.error) return state;
    return Object.assign({}, state, action.payload);
  },
  defaultState
);

export default api;
