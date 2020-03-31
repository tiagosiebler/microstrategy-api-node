const assert = require('assert');

const RestConnection = require('./util/RestConnection');

const AuthenticationAPI = require('./restAPIs/authentication');
const DatasetsAPI = require('./restAPIs/datasets');
const DossiersAndDocumentsAPI = require('./restAPIs/dossiersAndDocuments');

module.exports = class MicroStrategyRESTAPI extends RestConnection {
  constructor(...args) {
    super(...args);

    // https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Authentication
    this.authentication = new AuthenticationAPI(this);

    // https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Datasets
    this.datasets = new DatasetsAPI(this);

    // https://demo.microstrategy.com/MicroStrategyLibrary/api-docs/index.html#/Dossiers%20and%20Documents
    this.dossiersAndDocuments = new DossiersAndDocumentsAPI(this);

    return this;
  }

  login(...params) {
    return this.authentication.login(...params);
  }
  logout(...params) {
    return this.authentication.logout(...params);
  }

}