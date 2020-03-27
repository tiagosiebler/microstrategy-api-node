const assert = require('assert');
const RequestUtil = require('../util/RequestUtil');

const assertParam = (object, key) => {
  if (!key) {
    return assert(object, 'No params passed');
  }
  return assert(object[key], `Parameter ${key} is required`);
}

module.exports = class MicroStrategyRESTAPI extends RequestUtil {
  /*



    ############################ Authentication ############################

    https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Authentication

  */

  /**
   * Establish a session with MicroStrategy Library
   *
   * @param {Object} params
   * @param {boolean} [shouldStoreSession=true]
   * @param {boolean} [useStoredCredentials=false]
   * @returns
   */
  async login(params, shouldStoreSession = true, useStoredCredentials = false) {
    const savedParams = this.getSessionCredentials();
    if (useStoredCredentials && savedParams) {
      params = savedParams;
    }

    assertParam(params);
    assertParam(params, 'username');

    const response = await this._makeRequest('auth/login', params, 'POST');
    const headers = response.headers;

    if (response.status != 204) {
      throw {
        status: response.status,
        statusText: response.statusText || 'Login Failure',
        headers: headers,
        body: response.data
      }
    };

    const sessionState = {
      'X-MSTR-AuthToken': headers['x-mstr-authtoken'],
      'Cookie': headers['set-cookie'][0]
    };

    if (shouldStoreSession) {
      this.setSessionCredentials(params);
      this.setSessionState(sessionState);
    }

    return sessionState;
  }

  /**
   * Terminate a session with MicroStrategy Library - using the auth token as parameter
   *
   * @param {String or Object} token string or object with key 'X-MSTR-AuthToken'
   * @returns response object
   */
  async logout(token) {
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

    const result = await this._makeRequest(endpoint, false, method, this.getSessionState());
    if (result.status == 204) {
      this.setSessionState();
    }
    return result;
  }

  /*



    ############################ Dossiers and Documents ############################

    https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Dossiers%20and%20Documents

  */
  async getDossierDefinition(dossierId, projectId, sessionState = {}) {
    assert(dossierId, 'No dossierId provided');
    assert(projectId, 'No projectId provided');

    const headers = this.getProjectHeader(projectId, sessionState);
    const result = await this._makeRequest(`dossiers/${dossierId}/definition`, false, 'GET', headers);

    if (result.status != 200) {
      throw result;
    };
    return result.data;
  }

  async createDossierInstance(dossierId, projectId, body, asyncMode, sessionState = {}) {
    assert(dossierId, 'No dossierId provided');
    assert(projectId, 'No projectId provided');

    if (asyncMode) {
      sessionState['X-MSTR-AsyncMode'] = true;
    }
    const headers = this.getProjectHeader(projectId, sessionState);
    const result = await this._makeRequest(`dossiers/${dossierId}/instances`, body, 'POST', headers);
    if (result.status != 201) {
      throw result;
    };
    return result.data;
  }

  async getDossierVisualization(params, projectId, sessionState = {}) {
    assertParam(params);
    assertParam(params, 'dossierId');
    assertParam(params, 'instanceId');
    assertParam(params, 'chapterKey');
    assertParam(params, 'visualizationKey');

    const endpoint = `dossiers/${params.dossierId}/instances/${params.instanceId}/chapters/${params.chapterKey}/visualizations/${params.visualizationKey}`;
    const headers = this.getProjectHeader(projectId, sessionState);
    const result = await this._makeRequest(endpoint, params, 'GET', headers);
    if (result.status != 200) {
      throw result;
    };
    return result.data;
  }

}