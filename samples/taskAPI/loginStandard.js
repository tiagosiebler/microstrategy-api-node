const mstr = require('../../lib/mstr.js');

(async () => {
  const taskApi = new mstr.TaskAPI({
    taskProcUrl: 'http://aps-tsiebler-vm:8080/2020u1/servlet/taskProc'
  });

  const taskId = 'login';
  const taskParameters = {
    server: 'aps-tsiebler-vm',
    project: 'MicroStrategy Tutorial',
    userid: 'administrator',
    password: ''
  };

  try {
    const res = await taskApi.executeTask(taskId, taskParameters);
    console.log('task response: ', res.body);
  } catch (e) {
    console.error(e);
  }
})();