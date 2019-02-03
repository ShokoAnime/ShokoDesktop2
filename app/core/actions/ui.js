import { createAction } from 'redux-actions';

export const SET_UI = 'ACTION_SET_UI';
const setUi = createAction(SET_UI);

export default {
  setUi
};
