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

  const UserManagementAPI = mstrApi.userManagement;

  const newUserBody = {
    username: 'npmTest',
    fullName: 'NPM Test User',
    description: 'Created through NPM package'
  }
  const updateUserBody = {
    operationList: [
      {
        "op": "replace",
        "path": "/description",
        "value": "Updated description through NPM package"
      }
    ]
  }

  try {
    const userList = await UserManagementAPI.getUsers();
    console.log('All users: ', userList, '\n\n------ ------ ------ ------ ------\n');

    const userDefinition = await UserManagementAPI.createUser(newUserBody);
    const newUserID = userDefinition.id;

    await UserManagementAPI.updateUser(newUserID, updateUserBody);
    
    const user = await UserManagementAPI.getUser(newUserID);
    console.log('New user: ', user);

    await UserManagementAPI.deleteUser(newUserID);

  } catch (e) {
    console.error(e);
  }

  await mstrApi.logout();
})();