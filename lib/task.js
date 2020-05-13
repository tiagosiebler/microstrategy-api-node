const TaskConnection = require('./util/TaskConnection');

module.exports = class MicroStrategyTaskAPI extends TaskConnection {
  constructor(...args) {
    super(...args);

    return this;
  }

  executeTask(taskId, parameters = {}, taskEnv = 'xhr', taskContentType = 'json') {
    return this._executeTask(...arguments);
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