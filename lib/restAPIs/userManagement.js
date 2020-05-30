const assert = require("assert");

const assertParam = require("../util/assertParam");
const RestUtil = require("../util/RestUtil");
const buildCommonQuery = require("../util/buildCommonQueryParams");

module.exports = class RestTopic extends RestUtil {
  _getBase() {
    return "users";
  }

  getUsers(nameBegins, abbreviationBegins, offset = 0, limit = -1, fields) {
    const queryParameter = buildCommonQuery(fields, offset, limit);

    if (nameBegins) {
      queryParameter.nameBegins = nameBegins;
    }
    if (abbreviationBegins) {
      queryParameter.abbreviationBegins = abbreviationBegins;
    }
<<<<<<< HEAD
    return this._makeRequest(this._getBase(), queryParameter, 'GET')
      .then(result => this.throwIfFailed(result, 200));
=======
    return this._makeRequest(
      this._getBase(),
      queryParameter,
      "GET"
    ).then((result) => this.throwIfFailed(result, 200));
>>>>>>> 92f240c7e26915d26c4b414aead4cd7b544609d6
  }

  getUser(userId, fields) {
    assert(userId, "No userId provided");

    const queryParameter = buildCommonQuery(fields);
<<<<<<< HEAD
    return this._makeRequest(`${this._getBase()}/${userId}`, queryParameter, 'GET')
      .then(result => this.throwIfFailed(result, 200));
=======
    return this._makeRequest(
      `${this._getBase()}/${userId}`,
      queryParameter,
      "GET"
    ).then((result) => this.throwIfFailed(result, 200));
>>>>>>> 92f240c7e26915d26c4b414aead4cd7b544609d6
  }

  createUser(newUserBody = {}, fields) {
    assertParam(newUserBody);
    assertParam(newUserBody, "username");
    assertParam(newUserBody, "fullName");

    const queryParameter = buildCommonQuery(fields);
<<<<<<< HEAD
    return this._makeRequest(this._getBase(), newUserBody, 'POST', false, queryParameter)
      .then(result => this.throwIfFailed(result, 201));
=======
    return this._makeRequest(
      this._getBase(),
      newUserBody,
      "POST",
      false,
      queryParameter
    ).then((result) => this.throwIfFailed(result, 201));
>>>>>>> 92f240c7e26915d26c4b414aead4cd7b544609d6
  }

  deleteUser(userId) {
    assert(userId, "No userId provided");

<<<<<<< HEAD
    return this._makeRequest(this._getBase() + `/${userId}`, false, 'DELETE')
      .then(result => this.throwIfFailed(result, 204));
=======
    return this._makeRequest(
      this._getBase() + `/${userId}`,
      false,
      "DELETE"
    ).then((result) => this.throwIfFailed(result, 204));
>>>>>>> 92f240c7e26915d26c4b414aead4cd7b544609d6
  }

  updateUser(userId, userBody, fields) {
    assert(userId, "No userId provided");
    assertParam(userBody, "operationList");

    // Validate each object in operation list
    let opList = userBody.operationList;
<<<<<<< HEAD
    for (let i=0;i<opList.length;i++){
      assertParam(opList[i], 'op');
      assertParam(opList[i], 'path');
      assertParam(opList[i], 'value');
=======
    for (let i = 0; i < opList.length; i++) {
      assertParam(opList[i], "op");
      assertParam(opList[i], "path");
      assertParam(opList[i], "value");
>>>>>>> 92f240c7e26915d26c4b414aead4cd7b544609d6
    }

    const queryParameter = buildCommonQuery(fields);
<<<<<<< HEAD
    return this._makeRequest(this._getBase() + `/${userId}`, userBody, 'PATCH', false, queryParameter)
      .then(result => this.throwIfFailed(result, 200));
  }
};
=======
    return this._makeRequest(
      this._getBase() + `/${userId}`,
      userBody,
      "PATCH",
      false,
      queryParameter
    ).then((result) => this.throwIfFailed(result, 200));
  }
};
>>>>>>> 92f240c7e26915d26c4b414aead4cd7b544609d6
