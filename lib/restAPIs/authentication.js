const assert = require('assert');

const assertParam = require('../util/assertParam');
const RestUtil = require('../util/RestUtil');

const parseResponseSessionHeaders = (response = {}) => {
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
  return sessionHeaders;
}

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
        const sessionHeaders = parseResponseSessionHeaders(response);

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
  logout(token, clearStoredCredentials = false) {
    const endpoint = 'auth/logout';
    const method = 'POST';
    const body = false;

    if (token) {
      if (typeof token === 'String') {
        return this._makeRequest(endpoint, body, method, { 'X-MSTR-AuthToken': token });
      }
      assertParam(token);
      assertParam(token, 'X-MSTR-AuthToken');
      return this._makeRequest(endpoint, body, method, token)
    }

    return this._makeRequest(endpoint, body, method, this.getSessionHeaders())
      .then(result => {
        if (result.status == 204) {
          this.truncateStoredSession(clearStoredCredentials);
        }
        return result;
      });
  }

  /**
   * Clears any saved session state (token + cookies) from module memory.
   * This will simply forget the session. This will not close the session.
   * @param {String} clearStoredCredentials - defaults to true, any saved login credentials will be forgotten
   */
  truncateStoredSession(clearStoredCredentials = true) {
    this.setSessionHeaders();
    clearStoredCredentials && this.setSessionCredentials();
  }


  /**
   * Clears persisted cookies from memory
   */
  clearCookies() {
    return this.setSessionHeaders({
      Cookie: ''
    });
  }

  /**
   * Validate an existing identity token. Requires an existing session (cookie + auth token)
   * @param {String} identityToken
   * @returns response object
   */
  validateIdentityToken(identityToken) {
    const endpoint = 'auth/identityToken';
    const method = 'GET';

    assertParam(identityToken);

    const parameters = false;
    const customHeaders = {
      'X-MSTR-IdentityToken': identityToken
    };

    return this._makeRequest(endpoint, parameters, method, customHeaders)
    .then(result => this.throwIfFailed(result, 200))
    .catch(e => this.throwExceptionResponse(e));
  }

  /**
   * Create an identity token using an auth token
   * @param {String} (optional) authToken - if not provided, will use existing session in module
   * @returns {Promise[String]} resolving identity token
   */
  createIdentityToken(authToken = this.getAuthToken()) {
    assert(authToken, 'No authToken provided and none found in-memory. Login first or provide auth token.');

    const endpoint = 'auth/identityToken';
    const method = 'POST';
    const parameters = false;
    const customHeaders = {
      'X-MSTR-AuthToken': authToken
    };
    return this._makeRequest(endpoint, parameters, method, customHeaders)
      .then(response => {
        const headers = response.headers;

        if (response.status != 201) {
          throw {
            status: response.status,
            statusText: response.statusText || 'Failed to create token',
            headers: headers,
            body: response.data
          }
        };

        return headers['x-mstr-identitytoken'];
      })
      .catch(e => this.throwExceptionResponse(e));
  }

  /**
   * Create/restore a REST API session using an identity token
   * @param {String} identityToken
   * @param {Boolean} automaticallyStoreSession - true by default - if set, session is stored in memory for easier use in other methods.
   * @returns {Object} restored auth token & session cookie
   */
  restoreIdentityToken(identityToken, automaticallyStoreSession = true) {
    assert(identityToken, 'No identityToken provided - nothing to restore.');

    const endpoint = 'auth/delegate';
    const method = 'POST';
    const parameters = { loginMode: -1, identityToken };

    return this._makeRequest(endpoint, parameters, method)
      .then(response => {
        const sessionHeaders = parseResponseSessionHeaders(response);

        if (automaticallyStoreSession) {
          this.setSessionHeaders(sessionHeaders);
        }

        return sessionHeaders;
      })
      .catch(e => this.throwExceptionResponse(e));
  }
}