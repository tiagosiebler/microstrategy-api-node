const axios = require('axios');
const FormData = require('form-data');

const parseTaskResponse = response => ({
  status: response.status,
  statusText: response.statusText,
  headers: response.headers,
  body: response.data
});

/*
  A minimal mechanism for communicating with the task API in MicroStrategy Web
*/
module.exports = class TaskConnection {
  constructor({
    taskProcUrl = 'https://demo.microstrategy.com/MicroStrategy/servlet/taskProc'
  }) {
    this._baseUrl;
    this.setBaseUrl(taskProcUrl);

    this.sessionState;
  }


  /**
   * @returns URL pointing to MicroStrategy Library REST API base
   */
  getBaseUrl() {
    return this._baseUrl;
  }

  /**
   * @param {String} newUrl - URL pointing to MicroStrategy Library REST API base
   */
  setBaseUrl(newUrl) {
    this._baseUrl = newUrl;
    return this;
  }

  /**
   * Get stored session state from memory
   * @param {String} sessionState
   */
  getSessionState() {
    if (!this.sessionState) {
      throw new Error('No stored session state');
    }

    return this.sessionState;
  }

  /**
   * Store session state in memory
   * @param {String} sessionState
   */
  setSessionState(sessionState) {
    this.sessionState = sessionState;
    return this;
  }

  /**
   * Execute any task via the MicroStrategy Web Task API
   *
   * @param {String} taskId
   * @param {Object} [parameters={}] Key:value list of parameters
   * @param {String} [taskEnv='xhr']
   * @param {String} [taskContentType='json']
   * @param {String} (optional) Override the URL where the task API request goes. Defaults to taskProcUrl defined on class init.
   * @returns {Promise} Parsed response
   */
  _executeTask(taskId, parameters = {}, taskEnv = 'xhr', taskContentType = 'json', taskProcUrl = this.getBaseUrl()) {
    const formData = new FormData();
    formData.append('taskId', taskId);
    formData.append('taskEnv', taskEnv);
    formData.append('taskContentType', taskContentType);

    for (const key in parameters) {
      formData.append(key, parameters[key]);
    }

    const headers = formData.getHeaders();

    return axios.post(taskProcUrl, formData, { headers })
      .then(response => parseTaskResponse(response))
      .catch(e => {
        throw e.response ? parseTaskResponse(e.response) : e;
      });
  }
};
