const assert = require('assert');

const assertParam = require('../util/assertParam');
const RestUtil = require('../util/RestUtil');

module.exports = class RestTopic extends RestUtil {
  _getBase(){
    return 'users';
  }

  getUsers(nameBegins, abbreviationBegins, offset = 0, limit = -1, fields){
    const queryParameter = {
      offset: offset,
      limit: limit
    }
    if (nameBegins) {
      queryParameter.nameBegins = nameBegins;
    }
    if (abbreviationBegins) {
      queryParameter.abbreviationBegins = abbreviationBegins;
    }
    if (fields) {
      queryParameter.fields = fields;
    }
    return this._makeRequest(this._getBase(), queryParameter, 'GET')
    .then(result => this.throwIfFailed(result, 200));
  }

  getUser(userId, fields){
    assert(userId, 'No userId provided');
    const requestOpts = {};
    if (fields) {
      requestOpts.fields = fields;
    }
    return this._makeRequest(`${this._getBase()}/${userId}`, requestOpts, 'GET')
    .then(result => this.throwIfFailed(result, 200));
  }
}