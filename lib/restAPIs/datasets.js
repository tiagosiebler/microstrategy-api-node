const assert = require('assert');

const assertParam = require('../util/assertParam');
const RestUtil = require('../util/RestUtil');
const buildCommonQuery = require('../util/buildCommonQueryParams');

/*
  https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Dossiers%20and%20Documents
*/
module.exports = class RestTopic extends RestUtil {
  _getBase() {
    return 'datasets';
  }

  getDatasetDefinition(datasetId, fields) {
    assert(datasetId, 'No datasetId provided');

    const queryParameter = buildCommonQuery(false, false, fields);
    return this._makeRequest(`${this._getBase()}/${datasetId}`, queryParameter, 'GET', this.getProjectHeader())
    .then(result => this.throwIfFailed(result, 200));
  }

  createDataset(newDatasetBody = {}, fields) {
    assertParam(newDatasetBody);
    assertParam(newDatasetBody, 'name');
    assertParam(newDatasetBody, 'tables');

    const queryParameter = buildCommonQuery(false, false, fields);
    return this._makeRequest(this._getBase(), newDatasetBody, 'POST', this.getProjectHeader(), queryParameter)
    .then(result => this.throwIfFailed(result, 200));
  }

  updateDataset(datasetId, tableId, datasetBody, updatePolicy = 'Replace', fields) {
    assert(datasetId, 'No datasetId provided');
    assert(tableId, 'No tableId provided');
    assertParam(datasetBody);
    assertParam(datasetBody, 'name');
    assertParam(datasetBody, 'data');

    const headers = {
      updatePolicy: updatePolicy,
      ...this.getProjectHeader()
    }

    const queryParameter = buildCommonQuery(false, false, fields);
    return this._makeRequest(this._getBase() + `/${datasetId}/tables/${tableId}`, datasetBody, 'PATCH', headers, queryParameter)
    .then(result => this.throwIfFailed(result, 200));
  }

}