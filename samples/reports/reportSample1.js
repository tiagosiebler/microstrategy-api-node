const mstr = require('../../lib/mstr.js');

(async ()=> {
  const baseUrl = 'http://aps-tsiebler-vm:8080/2020u1Library/api';
  const mstrApi = new mstr.REST({
    baseUrl: baseUrl
  });

  await mstrApi.login({
    username: 'Administrator',
    password: '',
    loginMode: 1
  });

  // MicroStrategy Tutorial
  const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
  mstrApi.setProjectId(projectId);

  const objectId = '0C9AF3144240E7FC3EC6028137A9655C';

  const ReportsAPI = mstrApi.reports;

  try {
    const defn = await ReportsAPI.getReportDefinition(objectId);
    // console.log('res1: ', JSON.stringify(defn, null, 2));

    const instanceInfo = await ReportsAPI.createReportInstance(objectId);
    // console.log('res2: ', JSON.stringify(instanceInfo, null, 2));

    const instanceId = instanceInfo.instanceId;
    const instance = await ReportsAPI.getReportInstance(objectId, instanceId);
    console.log('res3: ', JSON.stringify(instance, null, 2));

    console.log('EOF');
  } catch (e) {
    console.error(e);
  }

  await mstrApi.logout();
})();