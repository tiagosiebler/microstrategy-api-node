const assert = require('assert');

const assertParam = require('../util/assertParam');
const RestUtil = require('../util/RestUtil');
const buildCommonQuery = require('../util/buildCommonQueryParams');

module.exports = class RestTopic extends RestUtil {
  /**
   * Get base endpoint for this API category
   */
  _getBase() {
    return 'library';
  }

  /**
   * Return object representing the library for the authenticated user.
   * @param {string} outputFlag - Filtered output. DEAFULT = include everything, FILTER_TOC = filter out chapters and pages.
   * @param {string} fields - Fields to be included in the result
   * @return {Object} Library for the authenticated user
   */
  getLibrary(outputFlag = 'DEFAULT', fields = '') {
    const queryParameter = buildCommonQuery(fields);
    queryParameter.outputFlag = outputFlag;

    return this._makeRequest(
      this._getBase(),
      queryParameter,
      'GET'
    ).then(result => this.throwIfFailed(result, 200));
  }

  /**
   * Publish an object (document or dossier) in project defined by projectID.
   * Information about object to publish and recipient are detailed in object 'publishInfo'.
   * https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Library/publishObject
   * @param {Object} publishInfo - Information of the object to publish
   * @param {string} projectID - Project ID
   */
  publishObject(publishInfo, projectID) {
    assert(publishInfo, 'No publishInfo provided');

    const customHeaders = this.getProjectHeader(projectID);
    return this._makeRequest(
      this._getBase(),
      publishInfo,
      'POST',
      customHeaders
    ).then(result => this.throwIfFailed(result, 204));
  }

  /**
   * Return object (document or dossier) identified by 'objectId' from project identified by 'projectId'
   * @param {string} projectId
   * @param {string} documentId
   * @param {string} fields - Fields to be included in the result. i.e. 'id,elements'
   * @returns {Object} - Representing the object
   */
  getObject(objectId, projectId, fields = '') {
    const queryParameter = buildCommonQuery(fields);
    const endpoint = `${this._getBase()}/${objectId}`;
    const customHeaders = this.getProjectHeader(projectId);
    return this._makeRequest(
      endpoint,
      queryParameter,
      'GET',
      customHeaders
    ).then(result => this.throwIfFailed(result, 200));
  }

  /**
   * Delete an object (dossier or document) identified by 'objectId' from project identified by 'projectId'
   * @param {string} projectId
   * @param {string} objectId
   */
  deleteObject(objectId, projectId) {
    const endpoint = `${this._getBase()}/${objectId}`;
    const queryParameter = buildCommonQuery();
    const customHeaders = this.getProjectHeader(projectId);

    return this._makeRequest(
      endpoint,
      queryParameter,
      'DELETE',
      customHeaders
    ).then(result => this.throwIfFailed(result, 204));
  }

  /**
   * Delete object (dossier or document) identified by 'objectId' from project identified by 'projectId' of user identified by 'userId'
   * @param {string} projectId
   * @param {string} objectId
   * @param {string} userId
   */
  deleteUserObject(objectId, userId, projectId) {
    assert(objectId, 'No objectId provided');
    assert(userId, 'No userId provided');
    const endpoint = `${this._getBase()}/${objectId}/recipients/${userId}`;
    const queryParameter = buildCommonQuery();
    const customHeaders = this.getProjectHeader(projectId);

    return this._makeRequest(
      endpoint,
      queryParameter,
      'DELETE',
      customHeaders
    ).then(result => this.throwIfFailed(result, 204));
  }
};
