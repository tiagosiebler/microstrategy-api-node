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
  }
};
