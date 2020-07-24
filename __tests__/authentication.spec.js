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

  describe('Authentication', () => {
    it('axios should have been called', async () => {
      const mstrApi = new mstr.REST({
        baseUrl: testUrl,
      });
      const sessionInfo = await mstrApi.login(loginInfo);

      expect(axios).toHaveBeenCalled();
    });

    it('should store auth token after successs ful lllogin', async () => {
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
});
