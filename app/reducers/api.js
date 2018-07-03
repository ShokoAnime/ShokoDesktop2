import { handleAction } from 'redux-actions';
import { API } from '../actions/api';

const defaultState = {
  user: '',
  password: '',
  key: '',
  host: 'http://127.0.0.1:8111'
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
