import { handleAction } from 'redux-actions';
import { SERIES } from '../core/actions/series';

const series = handleAction(
  SERIES,
  (state, action) => (action.error ? state : action.payload),
  []
);

export default series;
