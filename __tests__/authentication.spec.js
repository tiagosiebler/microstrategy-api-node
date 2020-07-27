const mstr = require('../lib/mstr');
const axios = require('axios');

jest.mock('axios', () =>
  jest.fn(() =>
    Promise.resolve({
      status: 204,
      headers: { 'x-mstr-authtoken': 'mockAuthToken' },
      //headers: {

      //}
    })
  )
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('MSTR REST', () => {
  const testUrl = 'http://localhost:8080/112U2Library/api';

  const loginInfo = {
    username: 'Administrator',
    password: '',
    loginMode: 1,
  };

  describe('Authentication -> Login', () => {
    it('axios should have been called', async () => {
      const mstrApi = new mstr.REST({
        baseUrl: testUrl,
      });
      const sessionInfo = await mstrApi.login(loginInfo);

      expect(axios).toHaveBeenCalled();
    });

    it('should store auth token after successsful login', async () => {
      const mstrApi = new mstr.REST({
        baseUrl: testUrl,
      });
      const sessionInfo = await mstrApi.login(loginInfo);
      const headers = mstrApi.getSessionHeaders();
      expect(headers['X-MSTR-AuthToken']).toEqual('mockAuthToken');
    });

    it('Should have been called with POST method', async () => {
      const mstrApi = new mstr.REST({
        baseUrl: testUrl,
      });
      const sessionInfo = await mstrApi.login(loginInfo);
      const method = expect.objectContaining({ method: 'POST' });
      expect(axios).toHaveBeenCalledWith(method);
    });

    it('Should have been with correct headers', async () => {
      const mstrApi = new mstr.REST({
        baseUrl: testUrl,
      });
      const sessionInfo = await mstrApi.login(loginInfo);
      const headers = expect.objectContaining({
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate, br',
          'Content-Type': 'application/json',
        },
      });
      expect(axios).toHaveBeenCalledWith(headers);
    });
  });

  //POST /api/logout
  describe('Authentication-> logout', () => {
    it('Axios should have been called', async () => {
      const mstrApi = new mstr.REST({
        baseUrl: testUrl,
      });
      const sessionInfo = await mstrApi.login(loginInfo);
      expect(axios).toHaveBeenCalledTimes(1);
      jest.clearAllMocks();
      mstrApi.logout();
      expect(axios).toHaveBeenCalledTimes(1);
    });

    it('Should have session information removed', async () => {
      const mstrApi = new mstr.REST({
        baseUrl: testUrl,
      });
      const sessionInfo = await mstrApi.login(loginInfo);
      const headers = mstrApi.getSessionHeaders();

      mstrApi.logout();
      expect(axios).toHaveBeenCalledTimes(2);
      //TODO
      //Test having X-MSTR-AuthToken set to undefined.
    });

    it('should have been called with the correct endpoint', async () => {
      const mstrApi = new mstr.REST({
        baseUrl: testUrl,
      });
      const sessionInfo = await mstrApi.login(loginInfo);
      jest.clearAllMocks();
      mstrApi.logout();
      expect(axios).toHaveBeenCalledTimes(1);
      const endpoint = expect.stringMatching('api/auth/logout');
      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({ url: endpoint })
      );
    });

    it('Should have ben caleed with POST method', async () => {
      const mstrApi = new mstr.REST({
        baseUrl: testUrl,
      });
      const sessionInfo = await mstrApi.login(loginInfo);
      jest.clearAllMocks();
      mstrApi.logout();
      expect(axios).toHaveBeenCalledTimes(1);
      const method = expect.objectContaining({ method: 'POST' });
      expect(axios).toHaveBeenCalledWith(method);
    });

    it('Should have been called with correct headers', async () => {
      const mstrApi = new mstr.REST({
        baseUrl: testUrl,
      });
      const sessionInfo = await mstrApi.login(loginInfo);
      jest.clearAllMocks();
      mstrApi.logout();
      const headers = expect.objectContaining({
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate, br',
          'Content-Type': 'application/json',
          'X-MSTR-AuthToken': 'mockAuthToken',
        },
      });
      expect(axios).toHaveBeenCalledWith(headers);
    });
  });
});
