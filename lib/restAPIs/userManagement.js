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

  createUser(newUserBody = {}, fields){
    assertParam(newUserBody);
    assertParam(newUserBody, 'username');
    assertParam(newUserBody, 'fullName');

    const requestOpts = {};
    if (fields) {
      requestOpts.queryParams = 'fields=' + fields.join('&fields=');
    }

    return this._makeRequest(this._getBase(), newUserBody, 'POST', {}, requestOpts)
    .then(result => this.throwIfFailed(result, 201));
  }

  deleteUser(userId){
    assert(userId, 'No userId provided');

    return this._makeRequest(this._getBase() + `/${userId}`, {}, 'DELETE', {})
    .then(result => this.throwIfFailed(result, 204));
  }

  updateUser(userId, userBody, fields){
    assert(userId, 'No userId provided');
    assertParam(userBody, 'operationList');

    // Validate each object in operation list
    let opList = userBody.operationList;
    for(let i=0;i<opList.length;i++){
      assertParam(opList[i], 'op');
      assertParam(opList[i], 'path');
      assertParam(opList[i], 'value');
    }
    
    const requestOpts = {};
    if (fields) {
      requestOpts.queryParams = 'fields=' + fields.join('&fields=');
    }
    return this._makeRequest(this._getBase() + `/${userId}`, userBody, 'PATCH', {}, requestOpts)
    .then(result => this.throwIfFailed(result, 200));
  }
}