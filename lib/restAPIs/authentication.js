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
    };
  }

  const sessionHeaders = {
    'X-MSTR-AuthToken': headers['x-mstr-authtoken'],
    'Cookie': headers['set-cookie'][0]
  };
  return sessionHeaders;
};

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
   * @param {String|Object} token string or object with key 'X-MSTR-AuthToken'
   * @returns response object
   */
  logout(token, clearStoredCredentials = false) {
    const endpoint = 'auth/logout';
    const method = 'POST';
    const body = false;

    if (token) {
      if (typeof token === 'string') {
        return this._makeRequest(endpoint, body, method, { 'X-MSTR-AuthToken': token });
      }
      assertParam(token);
      assertParam(token, 'X-MSTR-AuthToken');
      return this._makeRequest(endpoint, body, method, token);
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
   * @returns {Promise} resolving identity token
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
          };
        }

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

  /**
   * Extend HTTP & Intelligence Server sessions by resetting timeouts.
   */
  keepAlive() {
    const endpoint = 'sessions';
    const method = 'PUT';

    return this._makeRequest(endpoint, false, method)
      .then(result => this.throwIfFailed(result, 204))
      .catch(e => this.throwExceptionResponse(e));
  }

  /**
   * Get summary state on current configuration session for authenticated user.
   * @returns {Object} containing configuration session state
   */
  getConfigurationSessionInfo() {
    const endpoint = 'sessions';
    const method = 'GET';

    return this._makeRequest(endpoint, false, method)
      .then(result => this.throwIfFailed(result, 200))
      .catch(e => this.throwExceptionResponse(e));
  }

  /**
   * Get summary state on current project session for authenticated user.
   * @param {String} projectId - (optional) provide as parameter or pre-set using restApi.setProjectId()
   * @returns {Object} containing project session state
   */
  getProjectSessionInfo(projectId) {
    const endpoint = 'sessions/projectId';
    const method = 'GET';

    return this._makeRequest(endpoint, false, method, this.getProjectHeader(projectId))
      .then(result => this.throwIfFailed(result, 200))
      .catch(e => this.throwExceptionResponse(e));
  }

  /**
   * Get information for the authenticated user.
   * @returns {Object} containing currently authenticated metadata user
   */
  getUserInfo() {
    const endpoint = 'sessions/userInfo';
    const method = 'GET';

    return this._makeRequest(endpoint, false, method)
      .then(result => this.throwIfFailed(result, 200))
      .catch(e => this.throwExceptionResponse(e));
  }

  /**
   * Get a list of privileges for authenticated user
   * @returns {Array} with a list of privilege objects
   */
  getPrivilegesList() {
    const endpoint = 'sessions/privileges';
    const method = 'GET';

    return this._makeRequest(endpoint, false, method)
      .then(result => this.throwIfFailed(result, 200))
      .catch(e => this.throwExceptionResponse(e));
  }

  /**
   * Get information on a specific privilege, by integer ID
   * @param {Number} privilegeIdNumber - Number (or string containing number) representing privilege to query
   * @returns {Object} with more information on specified privilege & scope of privilege for this session
   */
  getPrivilegeInfo(privilegeIdNumber) {
    assert(privilegeIdNumber, 'Privilege ID is missing');
    const endpoint = `sessions/privileges/${privilegeIdNumber}`;
    const method = 'GET';

    return this._makeRequest(endpoint, false, method)
      .then(result => this.throwIfFailed(result, 200))
      .catch(e => this.throwExceptionResponse(e));
  }
};