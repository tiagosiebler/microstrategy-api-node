const assert = require('assert');

const assertParam = require('../util/assertParam');
const RestUtil = require('../util/RestUtil');

/*
  https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Dossiers%20and%20Documents
*/
module.exports = class RestTopic extends RestUtil {
  _getBase() {
    return 'dossiers';
  }

  _getV2Base() {
    return 'v2/dossiers';
  }

  /**
   * Get hierarchy of a dossier, uses predecessor to v2 API
   *
   * @param {*} dossierId
   * @returns
   */
  getDossierDefinition(dossierId) {
    assert(dossierId, 'No dossierId provided');

    return this._makeRequest(`${this._getV2Base()}/${dossierId}/definition`, false, 'GET', this.getProjectHeader())
      .then(result => this.throwIfFailed(result, 200));
  }

  /**
   * @deprecated Get hierarchy of a dossier, uses predecessor to v2 API
   *
   * @param {string} dossierId
   * @returns
   */
  getDossierDefinitionOld(dossierId) {
    assert(dossierId, 'No dossierId provided');

    return this._makeRequest(`${this._getBase()}/${dossierId}/definition`, false, 'GET', this.getProjectHeader())
      .then(result => this.throwIfFailed(result, 200));
  }

  /**
   * Execute a specific dossier and create an instance of the dossier
   *
   * @param {string} dossierId
   * @param {object} body (optional)
   * @param {boolean} asyncMode (optional)
   * @returns
   */
  createDossierInstance(dossierId, body, asyncMode) {
    assert(dossierId, 'No dossierId provided');

    const customHeaders = this.getProjectHeader();
    if (asyncMode) {
      customHeaders['X-MSTR-AsyncMode'] = true;
    }
    return this._makeRequest(`${this._getBase()}/${dossierId}/instances`, body, 'POST', customHeaders)
      .then(result => this.throwIfFailed(result, 201));
  }

  /**
   * Get the hierarchy of a specific dossier in a specific project from instance.
   *
   * @param {string} dossierId
   * @param {string} instanceId
   * @returns {Promise} resolving object representing dossier hierarchy
   */
  getDossierInstanceDefinition(dossierId, instanceId) {
    assert(dossierId, 'No dossierId provided');
    assert(instanceId, 'No instanceId provided');

    return this._makeRequest(`${this._getV2Base()}/${dossierId}/instances/${instanceId}/definition`, false, 'GET', this.getProjectHeader())
      .then(result => this.throwIfFailed(result, 200));
  }

  /**
   * Get the definition and data result of a grid/graph visuaization in a specific dossier & project.
   *
   * @param {string} dossierId
   * @param {string} instanceId
   * @param {string} chapterKey
   * @param {string} visualizationKey
   * @returns
   */
  getDossierVisualization(dossierId, instanceId, chapterKey, visualizationKey) {
    assert(dossierId, 'No dossierId provided');
    assert(instanceId, 'No instanceId provided');
    assert(chapterKey, 'No chapterKey provided');
    assert(visualizationKey, 'No visualizationKey provided');

    const endpoint = `${this._getV2Base()}/${dossierId}/instances/${instanceId}/chapters/${chapterKey}/visualizations/${visualizationKey}`;
    return this._makeRequest(endpoint, false, 'GET', this.getProjectHeader())
      .then(result => this.throwIfFailed(result, 200));
  }

};