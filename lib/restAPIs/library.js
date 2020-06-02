const assert = require("assert");

const assertParam = require("../util/assertParam");
const RestUtil = require("../util/RestUtil");
const buildCommonQuery = require("../util/buildCommonQueryParams");

module.exports = class RestTopic extends RestUtil {
  /**
   * Get base endpoint for this API category
   */
  _getBase() {
    return 'library';
  }

  /**
   * Return object representing the library for the authenticated user.
   * @param {array[String]} outputFlag - Filtered output. DEAFULT = include everything, FILTER_TOC = filter out cahpters and pages. 
   * @param {String} fields 
   */
  getLibrary( outputFlag = 'DEFAULT', fields = '',) {
    const queryParameter = buildCommonQuery(fields);
    queryParameter.outputFlag = outputFlag;

    return this._makeRequest(
      `${this._getBase()}`,
      queryParameter,
      "GET",
      null,
      null
    ).then((result) => this.throwIfFailed(result, 200));
  };

  /**
   * Publish an object (document or dossier) in project defined by projectID. Information about object to publish and recipient are detailed in object 'body'.
   * https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Library/publishObject
   * @param {String} projectID -  
   * @param {JSON object} body 
   */
  publishObject(projectID, body){
    const endpoint = `${this._getBase()}`;
    const customHeaders = this.getProjectHeader(projectID);
    return this._makeRequest(endpoint, body, 'POST', customHeaders)
    .then(result => this.throwIfFailed(result, 201));
  };

  /**
   * Return object (document or dossier) identified by 'objectId' from project identified by 'projectId'
   * @param {String} projectId 
   * @param {String} documentId 
   * @param {String} fields - Fields to be included in the result. i.e. 'id,elements'
   */
  getObject(projectId, objectId,  fields = ""){
    const queryParameter = buildCommonQuery(fields);
    const endpoint = `${this._getBase()}/${objectId}`;
    const customHeaders = this.getProjectHeader(projectId);
    return this._makeRequest(
      endpoint,
      queryParameter,
      'GET',
      customHeaders,
    )
    .then(
      (result) => this.throwIfFailed(result, 200)
    );
  };
};
