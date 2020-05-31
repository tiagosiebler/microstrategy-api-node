const assert = require("assert");

const assertParam = require("../util/assertParam");
const RestUtil = require("../util/RestUtil");
const buildCommonQuery = require("../util/buildCommonQueryParams");

module.exports = class RestTopic extends RestUtil {
  _getBase() {
    return "library";
  }

  getLibrary(fields = "", outputFlag = "DEFAULT") {
    const queryParameter = buildCommonQuery(fields);

    return this._makeRequest(
      `${this._getBase()}`,
      queryParameter,
      "GET",
      null,
      {
        outputFlag: outputFlag,
      }
    ).then((result) => this.throwIfFailed(result, 200));
  };

  publishToLibrary(projectID, body){
    const endpoint = `${this._getBase()}`;
    const customHeaders = this.getProjectHeader(projectID);
    return this._makeRequest(endpoint, body, 'POST', customHeaders)
    .then(result => this.throwIfFailed(result, 201));
  };

  getDocument(projectId, documentId,  fields = ""){
    const queryParameter =buildCommonQuery(fields);
    const endpoint = `${this._getBase()}/${documentId}`;
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
