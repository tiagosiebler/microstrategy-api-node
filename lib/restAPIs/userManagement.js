const assert = require('assert');

const assertParam = require('../util/assertParam');
const RestUtil = require('../util/RestUtil');

module.exports = class RestTopic extends RestUtil {
    _getBase(){
        return 'users';
    }
    getUsers(nameBegins = '', abbreviationBegins = '', offset = 0, limit = -1){

        const queryParameter = {
            nameBegins: nameBegins,
            abbreviationBegins: abbreviationBegins,
            offset: offset,
            limit: limit
        };
        return this._makeRequest(this._getBase(), queryParameter, 'GET')
        .then(result => this.throwIfFailed(result, 200));
    }

    getUser(userId){
        assert(userId, 'No userId provided');

        return this._makeRequest(`${this._getBase()}/${userId}`, false, 'GET')
        .then(result => this.throwIfFailed(result, 200));
    }
}