import { createAction } from 'redux-actions';

export const GET_DASHBOARD = 'ACTION_GET_DASHBOARD';
export const getDashboard = createAction(GET_DASHBOARD);

export default {
  getDashboard
};
