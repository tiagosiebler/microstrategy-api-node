const assert = require('assert');

const assertParam = require('../util/assertParam');
const RestUtil = require('../util/RestUtil');

/*
  https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Dossiers%20and%20Documents
*/
module.exports = class RestTopic extends RestUtil {
  _getBase() {
    return 'datasets';
  }

  getDatasetDefinition(datasetId, fields = []) {
    assert(datasetId, 'No datasetId provided');

    const joinedFields = fields.join('&fields=');
    const queryString = joinedFields ? 'fields=' + joinedFields : false;

    return this._makeRequest(`${this._getBase()}/${datasetId}`, queryString, 'GET', this.getProjectHeader())
    .then(result => this.throwIfFailed(result, 200));
  }

  createDataset(newDatasetBody = {}, fields) {
    assertParam(newDatasetBody);
    assertParam(newDatasetBody, 'name');
    assertParam(newDatasetBody, 'tables');

    const requestOpts = {};
    if (fields) {
      requestOpts.queryParams = 'fields=' + fields.join('&fields=');
    }

    return this._makeRequest(this._getBase(), newDatasetBody, 'POST', this.getProjectHeader(), requestOpts)
    .then(result => this.throwIfFailed(result, 200));
  }

  updateDataset(datasetId, tableId, datasetBody, updatePolicy = 'Replace', fields) {
    assert(datasetId, 'No datasetId provided');
    assert(tableId, 'No tableId provided');
    assertParam(datasetBody);
    assertParam(datasetBody, 'name');
    assertParam(datasetBody, 'data');

    const requestOpts = {};
    const headers = {
      updatePolicy: updatePolicy,
      ...this.getProjectHeader()
    }

    if (fields) {
      requestOpts.queryParams = '&fields=' + fields.join('&fields=');
    }

    return this._makeRequest(this._getBase() + `/${datasetId}/tables/${tableId}`, datasetBody, 'PATCH', headers, requestOpts)
    .then(result => this.throwIfFailed(result, 200));
  }

}