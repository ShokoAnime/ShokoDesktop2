import { handleAction } from 'redux-actions';
import { SET_UI } from '../actions/ui';

const ui = handleAction(
  SET_UI,
  (state, action) => Object.assign({}, state, action.payload),
  { groupFilter: false }
);

export default ui;
