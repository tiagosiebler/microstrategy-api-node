const assertParam = require('../util/assertParam');
const RestUtil = require('../util/RestUtil');

/*
  https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Authentication
*/
module.exports = class RestTopic extends RestUtil {

  /**
   * Establish a session with MicroStrategy Library
   *
   * @param {Object} params
   * @param {boolean} [shouldStoreSession=true]
   * @param {boolean} [useStoredCredentials=false]
   * @returns {Promise} resolving with session headers object
   */
  login(params, shouldStoreSession = true, useStoredCredentials = false) {
    const savedParams = this.getSessionCredentials();
    if (useStoredCredentials && savedParams) {
      params = savedParams;
    }

    assertParam(params);
    assertParam(params, 'username');

    return this._makeRequest('auth/login', params, 'POST')
      .then(response => {
        const headers = response.headers;

        if (response.status != 204) {
          throw {
            status: response.status,
            statusText: response.statusText || 'Login Failure',
            headers: headers,
            body: response.data
          }
        };

        const sessionHeaders = {
          'X-MSTR-AuthToken': headers['x-mstr-authtoken'],
          'Cookie': headers['set-cookie'][0]
        };

        if (shouldStoreSession) {
          this.setSessionCredentials(params);
          this.setSessionHeaders(sessionHeaders);
        }

        return sessionHeaders;
      });
  }

  /**
   * Terminate a session with MicroStrategy Library - using the auth token as parameter
   *
   * @param {String or Object} token string or object with key 'X-MSTR-AuthToken'
   * @returns response object
   */
  logout(token) {
    const endpoint = 'auth/logout';
    const method = 'POST';

    if (token) {
      if (typeof token === 'String') {
        return this._makeRequest(endpoint, false, method, { 'X-MSTR-AuthToken': token });
      }
      assertParam(token);
      assertParam(token, 'X-MSTR-AuthToken');
      return this._makeRequest(endpoint, false, method, token)
    }

    return this._makeRequest(endpoint, false, method, this.getSessionHeaders())
      .then(result => {
        if (result.status == 204) {
          this.setSessionHeaders();
        }
        return result;
      });
  }
}