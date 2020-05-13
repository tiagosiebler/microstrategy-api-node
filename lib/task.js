const TaskConnection = require('./util/TaskConnection');

module.exports = class MicroStrategyTaskAPI extends TaskConnection {
  constructor(...args) {
    super(...args);

    return this;
  }

  /**
   * Execute any task via the MicroStrategy Web Task API
   *
   * @param {String} taskId
   * @param {Object} [parameters={}] Key:value list of parameters
   * @param {String} [taskEnv='xhr']
   * @param {String} [taskContentType='json']
   * @param {String} taskProcUrl - (optional) Override the URL where the task API request goes. Defaults to taskProcUrl defined on class init.
   * @returns {Promise} Parsed response
   */
  executeTask(taskId, parameters = {}, taskEnv = 'xhr', taskContentType = 'json', taskProcUrl) {
    return this._executeTask(taskId, parameters, taskEnv, taskContentType, taskProcUrl);
  }

  async login() {

    const taskParameters = {
      server: 'aps-tsiebler-vm',
      project: 'MicroStrategy Tutorial',
      userid: 'administrator',
      password: ''
    };

   try {
    const res = await this._executeTask('login', taskParameters);
    console.log('taskres: ', res);
   } catch (E) {
     console.error(E);
   }
  }

  // login(...params) {
  //   return this.authentication.login(...params);
  // }

  // logout(...params) {
  //   return this.authentication.logout(...params);
  // }

  // clearCookies() {
  //   return this.authentication.clearCookies();
  // }
};