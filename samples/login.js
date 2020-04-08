const mstr = require('../lib/mstr.js');

(async ()=> {
  const baseUrl = 'http://aps-tsiebler-vm:8080/2020u1Library/api';
  const mstrApi = new mstr.REST({
    baseUrl: baseUrl
  });

  const loginRequest = {
    username: 'Administrator',
    password: '',
    loginMode: 1
  };

  const sessionInfo = await mstrApi.login(loginRequest);
  console.log('session',  sessionInfo);

  // 204 == success
  const logout = await mstrApi.logout();
  console.log(logout.status);
})();