const assert = require('assert');

const assertParam = require('../util/assertParam');
const RestUtil = require('../util/RestUtil');
const buildCommonQuery = require('../util/buildCommonQueryParams');

/*
  https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Reports
*/
module.exports = class RestTopic extends RestUtil {
  _getBase() {
    return 'reports';
  }

  getReportDefinition(objectId) {
    assert(objectId, 'No objectID provided');

    return this._makeRequest(`v2/${this._getBase()}/${objectId}`, false, 'GET', this.getProjectHeader())
    .then(result => this.throwIfFailed(result, 200));
  }
  createReportInstance(objectId, body, offset, limit, fields) {
    assert(objectId, 'No objectId provided');

    const requestOpts = buildCommonQuery(offset, limit, fields);

    return this._makeRequest(`v2/${this._getBase()}/${objectId}/instances`, body, 'POST', this.getProjectHeader(), requestOpts)
    .then(result => this.throwIfFailed(result, 200));
  }
  getReportInstance(objectId, instanceId, offset, limit, fields) {
    assert(objectId, 'No objectId provided');
    assert(instanceId, 'No instanceId provided');

    const requestOpts = buildCommonQuery(offset, limit, fields);
    return this._makeRequest(`v2/${this._getBase()}/${objectId}/instances/${instanceId}`, requestOpts.queryParams, 'GET', this.getProjectHeader())
    .then(result => this.throwIfFailed(result, 200));
  }
  updateReportInstance(objectId, instanceId, requestBody, offset, limit, fields) {
    assert(objectId, 'No objectId provided');
    assert(instanceId, 'No instanceId provided');
    assert(requestBody, 'No requestBody provided');

    const requestOpts = buildCommonQuery(offset, limit, fields);
    return this._makeRequest(`v2/${this._getBase()}/${objectId}/instances/${instanceId}`, requestOpts.queryParams, 'PUT', this.getProjectHeader())
    .then(result => this.throwIfFailed(result, 200));
  }

  /**
   * @deprecated Use v2 method instead (getReportDefinition)
   */
  getReportDefinitionV1(objectId) {
    assert(objectId, 'No objectID provided');

    return this._makeRequest(`${this._getBase()}/${objectId}`, false, 'GET', this.getProjectHeader())
    .then(result => this.throwIfFailed(result, 200));
  }
  /**
   * @deprecated Use v2 method instead (createReportInstance)
   */
  createReportInstanceV1(objectId, body, offset, limit, fields) {
    assert(objectId, 'No objectId provided');

    const requestOpts = buildCommonQuery(offset, limit, fields);

    return this._makeRequest(`${this._getBase()}/${objectId}/instances`, body, 'POST', this.getProjectHeader(), requestOpts)
    .then(result => this.throwIfFailed(result, 200));
  }
  /**
   * @deprecated Use v2 method instead (getReportInstance)
   */
  getReportInstanceV1(objectId, instanceId, offset, limit, fields) {
    assert(objectId, 'No objectId provided');
    assert(instanceId, 'No instanceId provided');

    const requestOpts = buildCommonQuery(offset, limit, fields);
    return this._makeRequest(`${this._getBase()}/${objectId}/instances/${instanceId}`, requestOpts.queryParams, 'GET', this.getProjectHeader())
    .then(result => this.throwIfFailed(result, 200));
  }

}