const mstr = require('../../lib/mstr.js');

(async ()=> {
  const baseUrl = 'http://aps-tsiebler-vm:8080/11.1GALibrary/api';
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

  const DatasetsAPI = mstrApi.datasets;

  try {
    const objectId = '1E221511416ECCD441986E942D92EEA0';
    const cubeDefinition = await DatasetsAPI.getDatasetDefinition(objectId);
    console.log('res: ', JSON.stringify(cubeDefinition, null, 2));

    console.log('EOF');
  } catch (e) {
    console.error(e);
  }

  await mstrApi.logout();
})();