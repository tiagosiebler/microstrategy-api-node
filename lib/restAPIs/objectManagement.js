const assert = require('assert');

const assertParam = require('../util/assertParam');
const RestUtil = require('../util/RestUtil');
const buildCommonQuery = require('../util/buildCommonQueryParams');

module.exports = class RestTopic extends RestUtil {
  _getBase(){
    return 'objects';
  }

  getObject(objectId, type, fields){
    assert(objectId, 'No objectId provided');
    assert(type, 'No type provided');
    
    const queryParameter = buildCommonQuery(fields);
    queryParameter.type = type;

    return this._makeRequest(`${this._getBase()}/${objectId}`, queryParameter, 'GET', this.getProjectHeader())
      .then(result => this.throwIfFailed(result, 200));
  }

  updateObject(objectId, type, objectsBody, flags, fields){
    assert(objectId, 'No objectId provided');
    assert(type, 'No type provided');
    assert(objectsBody, 'No objectsBody provided');

    const queryParameter = buildCommonQuery(fields);
    queryParameter.type = type;
    if (flags) {
      queryParameter.flags = flags;
    }
    return this._makeRequest(`${this._getBase()}/${objectId}`, objectsBody, 'PUT', this.getProjectHeader(), queryParameter)
      .then(result => this.throwIfFailed(result, 200));
  }

  copyObject(objectId, type, objectsBody, fields){
    assert(objectId, 'No objectId provided');
    assert(type, 'No type provided');
    assert(objectsBody, 'No objectsBody provided');

    const queryParameter = buildCommonQuery(fields);
    queryParameter.type = type;

    return this._makeRequest(`${this._getBase()}/${objectId}/copy`, objectsBody, 'POST', this.getProjectHeader(), queryParameter)
      .then(result => this.throwIfFailed(result, 201));
  }

  deleteObject(objectId, type){
    assert(objectId, 'No objectId provided');
    assert(type, 'No type provided');

    const queryParameter = {
      type: type
    };

    return this._makeRequest(`${this._getBase()}/${objectId}`, {}, 'DELETE', this.getProjectHeader(), queryParameter)
      .then(result => this.throwIfFailed(result, 204));
  }

  certifyObject(objectId, type, certify){
    assert(objectId, 'No objectId provided');
    assert(type, 'No type provided');
    assert(certify, 'No certify value provided');

    const queryParameter = {
      type: type,
      certify: certify
    };

    return this._makeRequest(`${this._getBase()}/${objectId}/certify`, {}, 'PUT', this.getProjectHeader(), queryParameter)
      .then(result => this.throwIfFailed(result, 200));
  }

  getRecommendations(objectId, offset, limit, fields){
    assert(objectId, 'No objectId provided');

    const queryParameter = buildCommonQuery(fields, offset, limit);

    return this._makeRequest(`${this._getBase()}/${objectId}/recommendations`, queryParameter, 'GET', this.getProjectHeader())
      .then(result => this.throwIfFailed(result, 200));
  }
};