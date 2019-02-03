function apiCallPost(apiAction, apiParams, apiKey, apiHost) {
  return window.fetch(`${apiHost}/api${apiAction}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      apikey: apiKey
    },
    body: JSON.stringify(apiParams),
    method: 'POST'
  });
}

function apiCallGet(apiAction, apiParams, apiKey, apiHost) {
  return window.fetch(`${apiHost}/api${apiAction}${apiParams}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      apikey: apiKey
    }
  });
}

function apiCall(apiState, apiAction, apiParams, type = 'GET') {
  const fetch =
    type === 'POST'
      ? apiCallPost(apiAction, apiParams, apiState.key, apiState.host)
      : apiCallGet(apiAction, apiParams, apiState.key, apiState.host);

  return fetch.then(response => {
    if (response.status !== 200) {
      return Promise.reject(
        `Network error: ${apiAction} ${response.status}: ${response.statusText}`
      );
    }
    return Promise.resolve(response);
  });
}

function jsonApiCall(apiState, apiAction, apiParams, type) {
  return apiCall(apiState, apiAction, apiParams, type).then(response =>
    response.json()
  );
}

function jsonApiResponse(apiState, apiAction, apiParams, type) {
  return jsonApiCall(apiState, apiAction, apiParams, type)
    .then(json => {
      if (json.code) {
        if (json.code !== 200) {
          return {
            error: true,
            code: json.code,
            message: json.message || 'No error message given.'
          };
        }
      }
      return { data: json };
    })
    .catch(reason => ({
      error: true,
      message: typeof reason === 'string' ? reason : reason.message
    }));
}

function getGroups(apiState) {
  return jsonApiResponse(apiState, '/group?nocast=1&tagfilter=63&level=1', '');
}

function getGroupFilters(apiState, id) {
  if (id) {
    return jsonApiResponse(
      apiState,
      `/filter?level=1&nocast=1&notag=1&id=${id}`,
      ''
    );
  }
  return jsonApiResponse(apiState, '/filter', '');
}

function getSeries(apiState, id) {
  if (id) {
    return jsonApiResponse(
      apiState,
      `/serie?allpics=1&tagfilter=63&level=1&id=${id}`,
      ''
    );
  }
  return jsonApiResponse(apiState, '/serie?nocast=1&tagfilter=63', '');
}

function postLogin(apiState, data) {
  return jsonApiResponse(apiState, '/auth', data, 'POST');
}

function getRandomImage(apiState) {
  return apiCall(apiState, '/image/7/random', '').catch(reason => ({
    error: true,
    message: typeof reason === 'string' ? reason : reason.message
  }));
}

function getDashboard(apiState) {
  return jsonApiResponse(apiState, '/modules/stats', '');
}

function getFileRecent(apiState) {
  return jsonApiResponse(apiState, '/file/recent', '?limit=10&level=-1');
}

function getSeriesRecent(apiState) {
  return jsonApiResponse(apiState, '/serie/recent', '?limit=10');
}

function getSeriesCalendar(apiState) {
  return jsonApiResponse(apiState, '/serie/calendar', '?limit=10');
}

export default {
  getGroups,
  getSeries,
  postLogin,
  getGroupFilters,
  getRandomImage,
  getDashboard,
  getFileRecent,
  getSeriesRecent,
  getSeriesCalendar
};
