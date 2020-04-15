const mstr = require('../../lib/mstr.js');
const convertStatusToString = require('./convertStatusToString');


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

  const cubeID = '718B6D694EB6F6D0AF0CABB1FB5623CB';

  const CubesAPI = mstrApi.cubes;

  try {
    const cubeStatus = await CubesAPI.getStatus(cubeID);
    const states = convertStatusToString(cubeStatus);
    if(!states.ready){
      await CubesAPI.publishCube(cubeID);
    }

    const instanceResponse = await CubesAPI.createCubeInstance(cubeID);
    const instanceID = instanceResponse.instanceId;

    const cubeData = await CubesAPI.getInstanceResults(cubeID, instanceID);
    console.log(cubeData);

  } catch (e) {
    console.error(e);
  }

  await mstrApi.logout();
})();