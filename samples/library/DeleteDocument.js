const mstr = require('../../lib/mstr');

(async () => {
  const baseUrl = 'http://10.23.1.124:8080/MicroStrategyLibrary/api';
  const mstrApi = new mstr.REST({
    baseUrl: baseUrl,
  });

  await mstrApi.login({
    username: 'Administrator',
    password: '',
    loginMode: 1,
  });

  // MicroStrategy Tutorial
  const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
  mstrApi.setProjectId(projectId);

  //Document id:
  const objectId = 'C866FC0B417F8BD4DBBC07BE57C83413';

  const libraryAPI = mstrApi.library;

  try {
    console.log('Deleting object from Library');
    const result = await libraryAPI.deleteObject(objectId);
    console.log('Object deleted: ', objectId);
  } catch (e) {
    console.error(e);
  }

  await mstrApi.logout();
})();
