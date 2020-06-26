const mstr = require('../../lib/mstr');
const RestConnection = require('../../lib/util/RestConnection');
const buildCommonQuery = require('../../lib/util/buildCommonQueryParams');
const axios = require('axios');

jest.mock('axios');

describe('Testing Library API', () => {
  it(' should have called axios', async () => {
    const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
    const objectId = 'C866FC0B417F8BD4DBBC07BE57C83413';
    const baseUrl = 'http://10.23.1.124:8080/MicroStrategyLibrary/api';
    const mstrApi = new mstr.REST({ baseUrl: baseUrl });
    mstrApi.setProjectId(projectId);
    expect(axios.request).toHaveBeenCalled();
  });

  it(' should have called axios in login', async () => {
    const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
    const objectId = 'C866FC0B417F8BD4DBBC07BE57C83413';
    const baseUrl = 'http://10.23.1.124:8080/MicroStrategyLibrary/api';
    const mstrApi = new mstr.REST({ baseUrl: baseUrl });
    axios.post.mockResolvedValue('hola');
    await mstrApi.login({
      username: 'Administrator',
      password: '',
      loginMode: 1,
    });
    expect(axios.post).toHaveBeenCalled();
    // mstrApi.setProjectId(projectId);
    // const library = mstrApi.library;
    // const object = library.getObject();
    // expect(axios.request).toHaveBeenCalledWith({ method: 'get' });
  });
});
