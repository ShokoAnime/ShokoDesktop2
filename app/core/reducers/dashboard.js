import { handleAction } from 'redux-actions';
import { GET_DASHBOARD } from '../actions/dashboard';

const dashboard = handleAction(
  GET_DASHBOARD,
  (state, action) => Object.assign(action.payload || state),
  {}
);

export default dashboard;
