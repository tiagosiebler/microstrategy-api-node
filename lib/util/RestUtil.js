
module.exports = class RestUtil {
  constructor(requestUtil) {
    this.request = requestUtil;
  }


  /**
   * Make HTTP request to MicroStrategy REST API
   *
   * @param {String} endpoint - example: 'auth/login'
   * @param {Object} params - request parameters
   * @param {String} [method='GET'] - HTTP method (GET/POST/PUT/DELETE/etc)
   * @param {Object} customHeaders - optional: extra headers to merge into request
   * @param {*} [advancedOptions={}]
   * @returns {Promise} resolving with axios request response.
   */
  _makeRequest(...params) {
    return this.request._makeRequest(...params);
  }

  /**
   * Get stored auth token from memory. Assumes token was previously stored via auth.login() or setSessionHeaders()
   * @returns {String} authToken
   */
  getAuthToken() {
    return this.request.getAuthToken();
  }

  /**
   * Store auth token in-memory for future executions. Other methods will automatically try to use this token.
   * @param {String} tokenValue
   */
  setAuthToken(tokenValue) {
    return this.request.setAuthToken(tokenValue);
  }

  /**
   * @returns {Object} reusable credentials object for authentication request
   */
  getSessionCredentials() {
    return this.request.getSessionCredentials();
  }

  /**
   * @returns {Object} key:value headers required for authenticated requests
   */
  getSessionHeaders() {
    return this.request.getSessionHeaders();
  }

  /**
   * Store headers required to make authenticated requests. Leave blank to clear.
   * @param {Object} sessionHeadersObject
   */
  setSessionHeaders(sessionHeadersObject) {
    return this.request.setSessionHeaders(sessionHeadersObject);
  }

  /**
   * Store object used to authenticate
   */
  setSessionCredentials(params) {
    return this.request.setSessionCredentials(params);
  }

  /**
   * Get header used to dictate which project to use.
   *
   * @param {String} projectId
   * @param {Object} [mergeHeaders={}] Optional, other headers to include in returned object.
   * @returns {Object} containing header to specify this project in a request
   */
  getProjectHeader(...params) {
    return this.request.getProjectHeader(...params);
  }

  throwIfFailed(result, successCode = 200, successField = 'data') {
    const skipCodeCheck = this.request.skipValidateResponseStatusCode === true;
    if (!skipCodeCheck && result.status != successCode) {
      throw result;
      // throw {
      //   request: result.config,
      //   response: {
      //     code: result.response.status,
      //     headers: result.response.headers,
      //     body: result.response.data,
      //   }
      // };
    }

    if (successField) {
      return result[successField];
    }

    return result;
  }

  /**
   * Throw REST response as exception
   * @param {Error} e - caught error from REST response
   */
  throwExceptionResponse(e) {
    if (this.request.skipThrowOnHTTPException === true) {
      return e;
    }
    throw (e && e.response && e.response.data) || e;
  }
};