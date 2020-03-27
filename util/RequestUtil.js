const axios = require('axios');
const qs = require('querystring');

module.exports = class RequestUtil {
  constructor({
    baseUrl = 'https://demo.microstrategy.com/MicroStrategyLibrary/api'
   }) {
    this._baseUrl;
    this.setBaseUrl(baseUrl);

    this.defaultHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    this.sessionState;
    this.sessionCredentials;
  }
  getDefaultHeaders() {
    return this.defaultHeaders;
  }
  getBaseUrl() {
    return this._baseUrl;
  }
  getSessionState() {
    return this.sessionState
  };
  setSessionState(sessionState) {
    this.sessionState = sessionState
  };
  getSessionCredentials() {
    return this.sessionCredentials;
  }
  setSessionCredentials(requestParams) {
    this.sessionCredentials = requestParams;
  }

  setBaseUrl(newUrl) {
    this._baseUrl = newUrl;
    // Ensure URL ends in backslash
    if (this.getBaseUrl().substr(-1) != '/') {
      this._baseUrl += '/';
    }
  }

  _makeRequest(endpoint, params, method = 'GET', customHeaders, advancedOptions = {}) {
    const fullUrl = this.getBaseUrl() + endpoint;

    switch (method.toUpperCase()) {
      case 'GET':
        return this.get(fullUrl, params, customHeaders);

      case 'POST':
        return this.post(fullUrl, params, customHeaders);
    }
  }

  async get(url, params, customHeaders = {}, mergeHeaders = true) {
    const options = {
      method: 'GET',
      headers: this.getHeaders(customHeaders, mergeHeaders),
      url: url
    };

    if (params) {
      options.url += '?' + qs.stringify(params);
    }

    return axios(options);
  }

  async post(url, params, customHeaders = {}, mergeHeaders = true) {
    const options = {
      method: 'POST',
      headers: this.getHeaders(customHeaders, mergeHeaders),
      data: params,
      url: url
    };

    if (params) {
      options.data = params;
    }

    return axios(options);
  }

  getHeaders(customHeaders = {}, mergeHeaders) {
    const defaultHeaders = this.getDefaultHeaders();
    const sessionHeaders = this.getSessionState();
    if (mergeHeaders) {
      return {
        ...customHeaders,
        ...defaultHeaders,
        ...sessionHeaders
      };
    }
    return !!Object.keys(customHeaders).length ? customHeaders : defaultHeaders;
  }

  getProjectHeader(projectId, mergeHeaders = {}) {
    return {
      'X-MSTR-ProjectID': projectId,
      ...mergeHeaders
    }
  }
}
