const mstr = require('../../lib/mstr.js');

/*
  Prerequisites:
  - The identityTokenSecretKey must be configured in MicroStrategy Web. This can be done from the MicroStrategy Web Admin page.
  - The same identityTokenSecretKey must be configured in MicroStrategy Library. This can be done from the MicroStrategy Library Admin page.

  Workflow:
  - create a session with the task API (or get the sessionState string from anywhere else)
  - create an identity token using that sessionState, via the task API's private task "createIdentityToken".
  - restore that identity token in the REST API client to obtain an auth token.
*/
(async () => {
  const taskApi = new mstr.TaskAPI({
    taskProcUrl: 'http://aps-tsiebler-vm:8080/2020u1/servlet/taskProc'
  });

  const restApi = new mstr.REST({
    baseUrl: 'http://aps-tsiebler-vm:8080/2020u1Library/api'
  });

  try {
    // STEP 1: Login to MicroStrategy Web and get a sessionState
    const loginTaskId = 'login';
    const loginTaskParameters = {
      server: 'aps-tsiebler-vm',
      project: 'MicroStrategy Tutorial',
      userid: 'administrator',
      password: ''
    };

    const loginResponse = await taskApi.executeTask(loginTaskId, loginTaskParameters);
    // console.log('task response: ', loginResponse.body);

    const sessionState = loginResponse.body && loginResponse.body.sessionState;
    console.log('taskAPI session state: ', sessionState);

    // STEP 2: Ask MicroStrategy Web for an identity token representing this session state via an out-of-the-box private task:
    const sessionToTokenTaskId = 'createIdentityToken';
    const sessionTaskParams = {
      sessionState: sessionState
    };
    const tokenResponse = await taskApi.executeTask(sessionToTokenTaskId, sessionTaskParams);
    const identityTokenFromWeb = tokenResponse.body && tokenResponse.body.identityToken;
    // console.log('response: ', tokenResponse.body);
    console.log('identityToken from web: ', identityTokenFromWeb);

    // STEP 3: Attempt to restore this identity token into a REST API session (auth token)
    const restoreTokenResponse = await restApi.authentication.restoreIdentityToken(identityTokenFromWeb);
    const authToken = restoreTokenResponse['X-MSTR-AuthToken'];
    // console.log('resp:', restoreTokenResponse);
    console.log('restored auth token from Library: ', authToken);

    // Test that this token works by asking for information on the currently authenticated user
    const activeUserInfo = await restApi.authentication.getUserInfo();
    console.log('user info: ', activeUserInfo);

  } catch (e) {
    console.error(e);
  }
})();