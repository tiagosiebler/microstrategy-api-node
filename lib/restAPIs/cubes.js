const assert = require('assert');

const RestUtil = require('../util/RestUtil');
const buildCommonQuery = require('../util/buildCommonQueryParams');

/*
  https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Cubes
*/
module.exports = class RestTopic extends RestUtil {
  _getBase() {
    return 'cubes';
  }

  getCubeDefinition(cubeId) {
    assert(cubeId, 'No cubeId provided');

    return this._makeRequest(`v2/${this._getBase()}/${cubeId}`, false, 'GET', this.getProjectHeader())
    .then(result => this.throwIfFailed(result, 200));
  }
  createCubeInstance(cubeId, body, offset, limit, fields) {
    assert(cubeId, 'No cubeId provided');

    const requestOpts = buildCommonQuery(fields, offset, limit);
    return this._makeRequest(`v2/${this._getBase()}/${cubeId}/instances`, body, 'POST', this.getProjectHeader(), requestOpts)
    .then(result => this.throwIfFailed(result, 200));
  }
  getInstanceResults(cubeId, instanceId, offset, limit, fields) {
    assert(cubeId, 'No objectId provided');
    assert(instanceId, 'No instanceId provided');

    const requestOpts = buildCommonQuery(fields, offset, limit);
    return this._makeRequest(`v2/${this._getBase()}/${cubeId}/instances/${instanceId}`, requestOpts, 'GET', this.getProjectHeader())
    .then(result => this.throwIfFailed(result, 200));
  }

  publishCube(cubeId, fields) {
    assert(cubeId, 'No cubeId provided');

    const requestOpts = buildCommonQuery(fields);
    return this._makeRequest(`${this._getBase()}/${cubeId}`, false, 'POST', this.getProjectHeader(), requestOpts)
    .then(result => this.throwIfFailed(result, 202));
  }

  getStatus(cubeId){
    assert(cubeId, 'No cubeId provided');

    return this._makeRequest(`${this._getBase()}/${cubeId}`, false, 'HEAD', this.getProjectHeader())
    .then(result => {
      this.throwIfFailed(result, 200);
      const headers = result.headers;
      return headers['x-mstr-cubestatus'];
    });
  }

  getCubesInfo(cubeIds, fields) {
    assert(cubeIds, 'No cubeIds provided');

    let requestOpts = buildCommonQuery(fields);
    requestOpts.id = cubeIds;

    return this._makeRequest(`${this._getBase()}`, requestOpts, 'GET', this.getProjectHeader())
    .then(result => this.throwIfFailed(result, 200));
  }

  getCubeAttributeElement(cubeId, attributeId, baseFormIds, offset, limit, fields){
    assert(cubeId, 'No cubeId provided');
    assert(attributeId, 'No attributeId provided');

    let requestOpts = buildCommonQuery(fields, offset, limit);
    if(baseFormIds){
      requestOpts.baseFormIds = baseFormIds;
    }
    
    return this._makeRequest(`${this._getBase()}/${cubeId}/attributes/${attributeId}/elements`, requestOpts, 'GET', this.getProjectHeader())
    .then(result => this.throwIfFailed(result, 200));
  }

  getCubeInstanceAttributeElement(cubeId, instanceId, attributeId, searchPattern, offset, limit, fields){
    assert(cubeId, 'No cubeId provided');
    assert(instanceId, 'No instanceId provided');
    assert(attributeId, 'No attributeId provided');

    let requestOpts = buildCommonQuery(fields, offset, limit);
    if(searchPattern){
      requestOpts.searchPattern = searchPattern;
    }

    return this._makeRequest(`${this._getBase()}/${cubeId}/instances/${instanceId}/attributes/${attributeId}/elements`, requestOpts, 'GET', this.getProjectHeader())
    .then(result => this.throwIfFailed(result, 200));
  }

  /**
   * @deprecated Use v2 method instead (getCubeDefinition)
   */
  getCubeDefinitionV1(cubeId) {
    assert(cubeId, 'No cubeId provided');

    return this._makeRequest(`${this._getBase()}/${cubeId}`, false, 'GET', this.getProjectHeader())
    .then(result => this.throwIfFailed(result, 200));
  }
  /**
   * @deprecated Use v2 method instead (createCubeInstance)
   */
  createCubeInstanceV1(cubeId, body, offset, limit, fields) {
    assert(cubeId, 'No cubeId provided');

    const requestOpts = buildCommonQuery(fields, offset, limit);

    return this._makeRequest(`${this._getBase()}/${cubeId}/instances`, body, 'POST', this.getProjectHeader(), requestOpts)
    .then(result => this.throwIfFailed(result, 200));
  }
  /**
   * @deprecated Use v2 method instead (getInstanceResults)
   */
  getInstanceResultsV1(cubeId, instanceId, offset, limit, fields) {
    assert(cubeId, 'No cubeId provided');
    assert(instanceId, 'No instanceId provided');

    const requestOpts = buildCommonQuery(fields, offset, limit);
    return this._makeRequest(`${this._getBase()}/${cubeId}/instances/${instanceId}`, requestOpts, 'GET', this.getProjectHeader())
    .then(result => this.throwIfFailed(result, 200));
  }

}