const assert = require('assert');

const assertParam = require('../util/assertParam');
const RestUtil = require('../util/RestUtil');
const buildCommonQuery = require('../util/buildCommonQueryParams');

/*
  https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Datasets
*/
module.exports = class RestTopic extends RestUtil {

  /**
   * @private get base endpoint for this API category
   * @returns {String} endpoint prefix
   */
  _getBase() {
    return 'datasets';
  }

  /**
   * @private get base endpoint for UploadSessions functionality in this API category
   * @param {String} datasetId - dataset (cube) ID that this session is connected to
   * @returns {String} endpoint prefix
   */
  _getUploadSessionBase(datasetId) {
    return this._getBase() + '/' + datasetId + '/uploadSessions';
  }

  /**
   * @public Get the definition of a specific MTDI dataset (single or multi-table).
   *
   * @param {String} datasetId (cube ID)
   * @param {Array} fields (optional)
   * @returns {Object} representing dataset definition
   */
  getDatasetDefinition(datasetId, fields) {
    assert(datasetId, 'No datasetId provided');

    const queryParameter = buildCommonQuery(fields);
    return this._makeRequest(`${this._getBase()}/${datasetId}`, queryParameter, 'GET', this.getProjectHeader())
      .then(result => this.throwIfFailed(result, 200));
  }

  /**
   * @public Create a structured single-table dataset. For complex or multi-table datasets, use UploadSessions. See createUploadSession().
   * @param {Object} [newDatasetBody={}] - Dataset creation info - see REST API documentation
   * @param {Array} fields (optional)
   * @returns {Object} { datasetId, name, tables[] }
   */
  createDataset(newDatasetBody = {}, fields) {
    assertParam(newDatasetBody);
    assertParam(newDatasetBody, 'name');
    assertParam(newDatasetBody, 'tables');

    const queryParameter = buildCommonQuery(fields);
    return this._makeRequest(this._getBase(), newDatasetBody, 'POST', this.getProjectHeader(), queryParameter)
      .then(result => this.throwIfFailed(result, 200));
  }

  /**
   * @public Create the definition of a dataset containing one or more tables, for use with an UploadSession.
   *
   * @param {Object} [newDatasetBody={}]
   * @param {Array} fields (optional)
   */
  createMultiTableDataset(newDatasetBody = {}, fields) {
    assertParam(newDatasetBody);
    assertParam(newDatasetBody, 'name');
    assertParam(newDatasetBody, 'tables');

    const queryParameter = buildCommonQuery(fields);
    return this._makeRequest(`${this._getBase()}/models`, newDatasetBody, 'POST', this.getProjectHeader(), queryParameter)
      .then(result => this.throwIfFailed(result, 200))
      .catch(e => this.throwExceptionResponse(e));
  }

  /**
   * @public Update data in a single-table dataset created via this API.
   *
   * @param {String} datasetId (cube ID)
   * @param {String} tableId - table ID or Name
   * @param {Object} datasetBody - Dataset update info - see REST API documentation
   * @param {string} [updatePolicy='Replace'] - Update operation type: Add, Update, Upsert, Replace
   * @param {Array} fields (optional)
   * @returns {Promise} resolving on success
   */
  updateDataset(datasetId, tableId, datasetBody, updatePolicy = 'Replace', fields) {
    assert(datasetId, 'No datasetId provided');
    assert(tableId, 'No tableId provided');
    assertParam(datasetBody);
    assertParam(datasetBody, 'name');
    assertParam(datasetBody, 'data');

    const projectHeaders = this.getProjectHeader();
    const headers = {
      updatePolicy: updatePolicy,
      ...projectHeaders
    };

    const queryParameter = buildCommonQuery(fields);
    return this._makeRequest(this._getBase() + `/${datasetId}/tables/${tableId}`, datasetBody, 'PATCH', headers, queryParameter)
      .then(result => this.throwIfFailed(result, 200));
  }

  /**
   * @public Create a multi-table dataset upload session and provide formatting information for the data that is to be uploaded to the Intelligence Server.
   *
   * @param {String} datasetId - ID of the existing dataset. If not existing yet, use DatasetAPI.createDataset()
   * @param {Object} tablesFormatting - object representation of table formatting, with update policy for this upload session
   * @returns {String} uploadSessionID
   */
  createUploadSession(datasetId, tablesFormatting) {
    assert(datasetId, 'No datasetId provided');
    assert(tablesFormatting, 'No tables formatting provided');

    return this._makeRequest(this._getUploadSessionBase(datasetId), tablesFormatting, 'POST', this.getProjectHeader())
      .then(result => this.throwIfFailed(result, 200))
      .then(result => result.uploadSessionId || result)
      .catch(e => this.throwExceptionResponse(e));
  }

  /**
   * @public Push data into upload session.
   *
   * @param {String} datasetId
   * @param {String} uploadSessionId
   * @param {String} tableName
   * @param {String|Number} index
   * @param {Object|string} data
   * @param {boolean} [encodeAutomatically=true] - (optional) - if true, data will be converted from JSON to base64 encoding automatically
   */
  uploadDataToUploadSession(datasetId, uploadSessionId, tableName, index, rawData, encodeAutomatically = true) {
    assert(datasetId, 'No datasetId provided');
    assert(uploadSessionId, 'No uploadSessionId provided');

    assert(tableName, 'No tableName provided');
    assert(index, 'No index provided');
    assert(rawData, 'No rawData provided');

    const uploadSessionBasePath = this._getUploadSessionBase(datasetId);
    const endpoint = `${uploadSessionBasePath}/${uploadSessionId}`;

    const dataAsString = typeof rawData == 'string' ? rawData : JSON.stringify(rawData);
    const base64encodedData = !encodeAutomatically ? rawData : Buffer.from(dataAsString).toString('base64');
    const requestBody = { tableName, index, data: base64encodedData };

    return this._makeRequest(endpoint, requestBody, 'PUT', this.getProjectHeader())
      .then(result => this.throwIfFailed(result, 200))
      .catch(e => this.throwExceptionResponse(e));
  }

  /**
   * @public Delete a specific multi-tavble dataset upload session and cancel publication.
   * If upload session has not been published, all dataset operations for upload session will be cancelled and the uploaded data will be discarded.
   *
   * @param {String} datasetId
   * @param {String} uploadSessionId
   */
  deleteUploadSession(datasetId, uploadSessionId) {
    assert(datasetId, 'No datasetId provided');
    assert(uploadSessionId, 'No uploadSessionId provided');

    const uploadSessionBasePath = this._getUploadSessionBase(datasetId);
    const endpoint = `${uploadSessionBasePath}/${uploadSessionId}`;

    return this._makeRequest(endpoint, false, 'DELETE', this.getProjectHeader())
      .then(result => this.throwIfFailed(result, 200))
      .catch(e => this.throwExceptionResponse(e));
  }

  /**
   * @public Publish a specific multi-table dataset using data uplaoded to the Intelligence Server.
   * Use after adding data to existing upload session.
   *
   * @param {String} datasetId
   * @param {String} uploadSessionId
   * @returns {Promise} - throws on failure, resolves on succses. Use getUploadSessionStatus() to poll publish status.
   */
  publishUploadSessionDataset(datasetId, uploadSessionId) {
    assert(datasetId, 'No datasetId provided');
    assert(uploadSessionId, 'No uploadSessionId provided');
    const uploadSessionBasePath = this._getUploadSessionBase(datasetId);
    const endpoint = `${uploadSessionBasePath}/${uploadSessionId}/publish`;

    return this._makeRequest(endpoint, false, 'POST', this.getProjectHeader())
      .then(result => this.throwIfFailed(result, 200))
      .catch(e => this.throwExceptionResponse(e));
  }

  /**
   * @public Get status of multi-table dataset operation, after uploading and publishing. Use after publishUploadSession().
   *
   * @param {String} datasetId
   * @param {String} uploadSessionId
   * @returns {Object} - { status, message }
   */
  getUploadSessionStatus(datasetId, uploadSessionId) {
    assert(datasetId, 'No datasetId provided');
    assert(uploadSessionId, 'No uploadSessionId provided');
    const uploadSessionBasePath = this._getUploadSessionBase(datasetId);
    const endpoint = `${uploadSessionBasePath}/${uploadSessionId}/publishStatus`;

    return this._makeRequest(endpoint, false, 'GET', this.getProjectHeader())
      .then(result => this.throwIfFailed(result, 200))
      .catch(e => this.throwExceptionResponse(e));
  }
};