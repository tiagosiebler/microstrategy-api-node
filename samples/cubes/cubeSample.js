const mstr = require('../../lib/mstr.js');

(async ()=> {
  const baseUrl = 'http://10.27.72.72:8080/2020u1Library/api';
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

  const objectId = '260319644637B3DAE447948C61FA7045';
  const cubeIds = ['12341241','8567875685','092348092384'];

  const CubesAPI = mstrApi.cubes;

  try {
    const cubeInfo = CubesAPI.publishCube(objectId);
    console.log(cubeInfo);
  } catch (e) {
    console.error(e);
  }

  await mstrApi.logout();
})();