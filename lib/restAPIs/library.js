const assert = require("assert");

const assertParam = require("../util/assertParam");
const RestUtil = require("../util/RestUtil");
const buildCommonQuery = require("../util/buildCommonQueryParams");

module.exports = class RestTopic extends RestUtil {
  _getBase() {
    return "library";
  }

  getLibrary(fields = "", outputFlag = "DEFAULT") {
    // if (fields) {
    //   fields += `,${outputFlag}`;
    // } else {
    //   fields = outputFlag;
    // }

    const queryParameter = buildCommonQuery(fields);

    return this._makeRequest(`${this._getBase()}`, queryParameter, "GET", {
      outputFlag: outputFlag,
    }).then((result) => this.throwIfFailed(result, 200));
  }
};
