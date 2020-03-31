const mstr = require('../../lib/mstr.js');

(async ()=> {
  const baseUrl = 'http://10.27.72.72:8080/11.1GALibrary/api';
  const mstrApi = new mstr.REST({
    baseUrl: baseUrl
  });

  await mstrApi.login({
    username: 'Administrator',
    password: '',
    loginMode: 1
  });

  const UserManagementAPI = mstrApi.userManagement;

  try {
    const userList = await UserManagementAPI.getUsers(undefined, 'B', 1);
    console.log(userList);
  } catch (e) {
    console.error(e);
  }

  await mstrApi.logout();
})();