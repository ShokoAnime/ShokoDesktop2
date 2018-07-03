// @flow
let storeConfig;
if (process.env.NODE_ENV === 'production') {
  storeConfig = require('./configureStore.prod'); // eslint-disable-line global-require
} else {
  storeConfig = require('./configureStore.dev'); // eslint-disable-line global-require
}
const store = storeConfig.configureStore();

const configuredStore = {
  store,
  history: storeConfig.history
};

module.exports = configuredStore;
