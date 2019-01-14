import { handleAction } from 'redux-actions';
import { SERIES } from '../actions/series';

const series = handleAction(
  SERIES,
  (state, action) => (action.error ? state : action.payload),
  []
);

export default series;
