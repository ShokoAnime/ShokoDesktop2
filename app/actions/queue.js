import { createAction } from 'redux-actions';

export const API_QUEUE_ADD = 'ACTION_API_QUEUE_ADD';
const apiQueueAdd = createAction(API_QUEUE_ADD);

export const API_QUEUE_REMOVE = 'ACTION_API_QUEUE_REMOVE';
const apiQueueRemove = createAction(API_QUEUE_REMOVE);

export const API_QUEUE_UPDATE = 'API_QUEUE_UPDATE';
const apiQueueUpdate = createAction(API_QUEUE_UPDATE);

export const NOTIFICATIONS_QUEUE_ADD = 'NOTIFICATIONS_QUEUE_ADD';
const notificationsQueueAdd = createAction(NOTIFICATIONS_QUEUE_ADD);

export const NOTIFICATIONS_QUEUE_REMOVE = 'NOTIFICATIONS_QUEUE_REMOVE';
const notificationsQueueRemove = createAction(NOTIFICATIONS_QUEUE_REMOVE);

export default {
  apiQueueAdd,
  apiQueueRemove,
  apiQueueUpdate,
  notificationsQueueAdd,
  notificationsQueueRemove
};
