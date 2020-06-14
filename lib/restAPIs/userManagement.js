const assert = require('assert');

const assertParam = require('../util/assertParam');
const RestUtil = require('../util/RestUtil');
const buildCommonQuery = require('../util/buildCommonQueryParams');

module.exports = class RestTopic extends RestUtil {
  _getBase() {
    return 'users';
  }

  /**
   * @public Get information for a specific set of users.
   * @param {String} nameBegins - Characters that the user name must begin with
   * @param {String} abbreviationBegins - Characters that the user abbreviation must begin with
   * @param {int} offset - Used to control paging behaviour
   * @param {int} limit - Maximum number of items returned
   * @param {String} fields - Top level fields to be included in the response
   */
  getUsers(nameBegins, abbreviationBegins, offset = 0, limit = -1, fields) {
    const queryParameter = buildCommonQuery(fields, offset, limit);

    if (nameBegins) {
      queryParameter.nameBegins = nameBegins;
    }
    if (abbreviationBegins) {
      queryParameter.abbreviationBegins = abbreviationBegins;
    }
    return this._makeRequest(
      this._getBase(),
      queryParameter,
      'GET'
    ).then(result => this.throwIfFailed(result, 200));
  }

  /**
   * @public Get info for a specific user
   * @param {String} userId - User ID
   * @param {String} fields - Top level fields to be included in the response
   */
  getUser(userId, fields) {
    assert(userId, 'No userId provided');

    const queryParameter = buildCommonQuery(fields);
    return this._makeRequest(
      `${this._getBase()}/${userId}`,
      queryParameter,
      'GET'
    ).then(result => this.throwIfFailed(result, 200));
  }
  /**
   * @public Create a new user
   * @param { Object} newUserBody - User information
   * @param { String } fields - Top level fields to be included in the response
   */
  createUser(newUserBody = {}, fields) {
    assertParam(newUserBody);
    assertParam(newUserBody, 'username');
    assertParam(newUserBody, 'fullName');

    const queryParameter = buildCommonQuery(fields);
    return this._makeRequest(
      this._getBase(),
      newUserBody,
      'POST',
      false,
      queryParameter
    ).then(result => this.throwIfFailed(result, 201));
  }

  /**
   * @public Delete user for a specific ID
   * @param {String} userId - User ID
   */
  deleteUser(userId) {
    assert(userId, 'No userId provided');

    return this._makeRequest(
      this._getBase() + `/${userId}`,
      false,
      'DELETE'
    ).then(result => this.throwIfFailed(result, 204));
  }

  /**
   * @public Update specific information for the user identified by userId
   * @param {String} userId - User ID
   * @param {Object} userBody -  User update information
   * @param {String} fields - Top level fields to be included in the response
   */
  updateUser(userId, userBody, fields) {
    assert(userId, 'No userId provided');
    assertParam(userBody, 'operationList');

    // Validate each object in operation list
    let opList = userBody.operationList;
    for (let i = 0; i < opList.length; i++) {
      assertParam(opList[i], 'op');
      assertParam(opList[i], 'path');
      assertParam(opList[i], 'value');
    }

    const queryParameter = buildCommonQuery(fields);
    return this._makeRequest(
      this._getBase() + `/${userId}`,
      userBody,
      'PATCH',
      false,
      queryParameter
    ).then(result => this.throwIfFailed(result, 200));
  }
};
