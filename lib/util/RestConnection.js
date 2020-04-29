const axios = require('axios');
const qs = require('querystring');

module.exports = class RestConnection {
  constructor({
    baseUrl = 'https://demo.microstrategy.com/MicroStrategyLibrary/api'
   }) {
    this._baseUrl;
    this.setBaseUrl(baseUrl);

    this.defaultHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    this.sessionHeaders;
    this.sessionCredentials;
  }


  /**
   * @returns {Object} default headers required by almost every request
   */
  getDefaultHeaders() {
    return this.defaultHeaders;
  }


  /**
   * @returns URL pointing to MicroStrategy Library REST API base
   */
  getBaseUrl() {
    return this._baseUrl;
  }

  /**
   * @param {String} newUrl - URL pointing to MicroStrategy Library REST API base
   */
  setBaseUrl(newUrl) {
    this._baseUrl = newUrl;
    // Ensure URL ends in backslash
    if (this.getBaseUrl().substr(-1) != '/') {
      this._baseUrl += '/';
    }
    return this;
  }

  getSessionHeaders() {
    return this.sessionHeaders;
  };
  setSessionHeaders(sessionHeaders = {}) {
    this.sessionHeaders = sessionHeaders;
    return this;
  };

  getSessionCredentials() {
    return this.sessionCredentials;
  }
  setSessionCredentials(requestParams = {}) {
    this.sessionCredentials = requestParams;
    return this;
  }

  setProjectId(projectID) {
    this.projectID = projectID;
    return this;
  }
  getProjectId() {
    return this.projectID;
  }

  /**
   * Get header used to dictate which project to use.
   *
   * @param {String} projectId
   * @param {Object} [mergeHeaders={}] Optional, other headers to include in returned object.
   * @returns {Object} containing header to specify this project in a request
   */
  getProjectHeader(projectId = this.getProjectId(), mergeHeaders = {}) {
    return {
      'X-MSTR-ProjectID': projectId,
      ...mergeHeaders
    }
  }


  /**
   * Make HTTP request to MicroStrategy REST API
   *
   * @param {String} endpoint - example: 'auth/login'
   * @param {Object} params - request parameters
   * @param {String} [method='GET'] - HTTP method (GET/POST/PUT/DELETE/etc)
   * @param {Object} customHeaders - optional: extra headers to merge into request
   * @param {*} [additionalOptions={}] - Additional query parameters used in specific endpoints
   * @returns {Promise} resolving with axios request response.
   */
  _makeRequest(endpoint, params, method = 'GET', customHeaders, additionalOptions={}) {
    const fullUrl = this.getBaseUrl() + endpoint;

    switch (method.toUpperCase()) {
      case 'GET':
        return this.get(fullUrl, params, customHeaders);
      
      case 'HEAD':
        return this.get(fullUrl, params, customHeaders, true, 'HEAD');

      case 'POST':
        return this.post(fullUrl, params, additionalOptions, customHeaders);

      case 'PATCH':
        return this.post(fullUrl, params, additionalOptions, customHeaders, 'PATCH');
      
      case 'DELETE':
        return this.post(fullUrl, params, additionalOptions, customHeaders, 'DELETE');

      case 'PUT':
        return this.post(fullUrl, params, additionalOptions, customHeaders, 'PUT');
      
    }
  }

  get(url, queryParams, customHeaders = {}, mergeHeaders = true, requestMethod = 'GET') {
    const options = {
      method: requestMethod,
      headers: this._getHeaders(customHeaders, mergeHeaders),
      url: url
    };

    if (queryParams) {
      options.url += '?' + qs.stringify(queryParams);
    }
    // console.log("Making GET request: ", options);
    return axios(options);
  }

  post(url, requestBody, queryParams, customHeaders = {}, requestMethod = 'POST', mergeHeaders = true) {
    const options = {
      method: requestMethod,
      headers: this._getHeaders(customHeaders, mergeHeaders),
      data: requestBody,
      url: url
    };

    if(queryParams){
      options.url += '?' + qs.stringify(queryParams);
    }

    if (requestBody) {
      options.data = requestBody;
    }
    // console.log("Making POST request: ", options);

    return axios(options);
  }

  /**
   * @private Merge headers and automatically append sessionHeaders if available
   *
   * @param {*} [customHeaders={}]
   * @param {*} mergeHeaders
   * @returns
   */
  _getHeaders(customHeaders = {}, mergeHeaders) {
    const defaultHeaders = this.getDefaultHeaders();
    const sessionHeaders = this.getSessionHeaders();
    if (mergeHeaders) {
      return {
        ...customHeaders,
        ...defaultHeaders,
        ...sessionHeaders
      };
    }
    return !!Object.keys(customHeaders).length ? customHeaders : defaultHeaders;
  }
}
