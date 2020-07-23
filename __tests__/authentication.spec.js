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

describe('MSTR REST', () => {
  const testUrl = 'http://localhost:8080/112U2Library/api';

  const loginInfo = {
    username: 'Administrator',
    password: '',
    loginMode: 1,
  };

  const mstrApi = new mstr.REST({
    baseUrl: testUrl,
  });

  describe('Authentication', () => {
    test('axios should have been called', async () => {
      const sessionInfo = await mstrApi.login(loginInfo);
      expect(axios).toHaveBeenCalled();
    });
    it('should store auth token after successs ful lllogin', () => {
      const headers = mstrApi.getSessionHeaders();
      expect(headers['X-MSTR-AuthToken']).toEqual('mockAuthToken');
    });

    // it('should have been called with POST method', async () => {
    //   const endpoint = expect.stringContaining('/api/auth/login');
    //   const sessionInfo = await mstrApi.login(loginInfo);
    //   const headers = mstrApi.getSessionHeaders();
    //   expect(axios).toHaveBeenCalledWith({
    //     url: endpoint,
    //     method: 'POST',
    //     headers,
    //   });
    // });

    it('Should have been called with POST method', async () => {
      const sessionInfo = await mstrApi.login(loginInfo);
      const method = expect.objectContaining({ method: 'POST' });
      expect(axios).toHaveBeenCalledWith(method);
    });

    it('Should have been with correct headers', async () => {
      const headers = expect.objectContaining({
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate, br',
          'Content-Type': 'application/json',
          'X-MSTR-AuthToken': 'mockAuthToken',
        },
      });
      const sessionInfo = await mstrApi.login(loginInfo);
      expect(axios).toHaveBeenCalledWith(headers);
    });
  });
});
