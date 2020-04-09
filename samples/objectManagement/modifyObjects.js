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

  const ObjectManagementAPI = mstrApi.objectManagement;

  const objectID = '6DBBD2404562BC0C580E1B8B18DAEAA8';
  const type = 8; // Integer from EnumDSSXMLObjectTypes

  const copyObjecctBody = {
    name: 'Copied from NPM Package',
    folderId: 'B0923C34402DF0DFB685C7B398E0636A'
  }

  const updateObjectBody = {
    name: 'Updated from NPM Package'
  };

  try {
    const newObject = await ObjectManagementAPI.copyObject(objectID, type, copyObjecctBody);
    const newObjectId = newObject.id;
    console.log('New Object ID: ', newObjectId);

    await ObjectManagementAPI.updateObject(newObjectId, type, updateObjectBody, 70);
    const objectInfo = await ObjectManagementAPI.getObject(newObjectId, type);
    console.log(objectInfo);

    await ObjectManagementAPI.deleteObject(newObjectId, type);
  } catch (e) {
    console.error(e);
  }

  await mstrApi.logout();
})();