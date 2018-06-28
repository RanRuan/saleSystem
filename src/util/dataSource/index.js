// require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';
import auth from '../auth';
import config from '../../config';
// import {browserHistory} from "react-router";

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};
const basePath = config.basePath;

function getConfig(options) {
  if(options && options.hasOwnProperty('auth') && options.auth === false) {
    return {
      headers: {
        ...headers
      }
    };
  }
  let token = auth.getToken() || null;
  return {
    headers: {
      ...headers,
      Authorization: token
    }
  };
}

function URLquery(queryObject) {
  let str = '';
  let buffer = [];
  for(let key in queryObject) {
    if(queryObject[key] instanceof Array) {
      buffer.push(`${key}=${queryObject[key].join(',')}`);
    }else if(queryObject[key] !== null || queryObject[key] !== undefined) {
      buffer.push(`${key}=${queryObject[key]}`);
    }
  }
  str = buffer.join('&');
  return str;
}
function URLMerge(url, query) {
  let queryStr = URLquery(query);
  if(queryStr) {
    return url + `?${queryStr}`;
  }
  return url;
}

function getFinalPath(url, conf) {
  if(conf.basePath) {
    return conf.basePath + url;
  }
  return basePath + url;
}

function callRemote(path, conf) {
  let url = getFinalPath(path, conf);
  return fetch(url, conf)
  .then(response => {
    let status = Number(response.status);
    if(status === 403) {
      return {response}
    }
    if(status === 404) {
      // browserHistory.replace('/404');
    }else if(status === 503) {
      // browserHistory.replace('/server-error');
    }else if(status === 204) {
      return {response};
    }else if(status === 401) {
      toLogin();
    }
    return response.json()
      .then(json => ({json, response}));
  })
  .then(({json, response}) => {
    let status = Number(response.status);
    if(status === 204) {
      return {data: null, paging: null};
    }
    if(!response.ok && status !== 201) {
      return Promise.reject(json);
    }
    // if(Number(json.code) !== 0) {
    //   return Promise.reject(json);
    // }
    let paging = JSON.parse(response.headers.get('Paging'));
    return {data: json.data, source: json, paging};
  });
}

const DS = {
  query(url, q, options) {
    let path = url;
    if (q) {
      path = URLMerge(url, q);
    }
    return callRemote(path, {...getConfig(options), method: 'GET', ...options});
  },

  update(url, body, options) {
    return callRemote(url, {...getConfig(options), method: 'PUT', body: JSON.stringify(body), ...options});
  },

  create(url, body, options) {
    return callRemote(url, {...getConfig(options), method: 'POST', body: JSON.stringify(body), ...options});
  },

  destroy(url, options = {}) {
    let callConf = {
      ...getConfig(options),
      method: 'DELETE',
      ...options
    };
    if(Reflect.has(options, 'body')) {
      callConf.body = JSON.stringify(options.body);
    }
    return callRemote(url, callConf);
  },

  patch(url, body, options) {
    let callConf = {
      ...getConfig(options),
      method: 'PATCH',
      ...options
    };
    if(body) {
      callConf.body = JSON.stringify(body);
    }
    return callRemote(url, callConf);
  }

};
export default DS;

function toLogin() {
  auth.removeToken();
  // ...
  // browserHistory.replace('/auth/login');
}
