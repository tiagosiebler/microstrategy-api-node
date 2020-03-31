const assert = require('assert');

const assertParam = require('../util/assertParam');
const RestUtil = require('../util/RestUtil');

/*
  ############################ Dossiers and Documents ############################
  https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Dossiers%20and%20Documents
*/
module.exports = class RestTopic extends RestUtil {
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