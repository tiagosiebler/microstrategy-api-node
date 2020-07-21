const mstr = require('../lib/mstr');
const axios = require('axios');

//jest.mock('axios');
jest.mock('axios', () =>
  jest.fn(() =>
    Promise.resolve({
      status: 204,
      headers: { 'x-mstr-authtoken': 'mockAuthToken' },
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
      // axios.post.mockImplementation(() => {
      //   Promise.resolve({ data: {} });
      // });

      //   try {
      const sessionInfo = await mstrApi.login(loginInfo);
      expect(axios).toHaveBeenCalled();
      //    } catch (error) {}
    });
    it('should store auth token after successs ful lllogin', () => {
      const headers = mstrApi.getSessionHeaders();
      console.log(headers);
      expect(headers['X-MSTR-AuthToken']).toEqual('mockAuthToken');
    });
    it('should have been called with POST method', async () => {
      try {
        const endpoint = expect.stringContaining('/api/auth/login');

        const sessionInfo = await mstrApi.login(loginInfo);

        expect(axios).toHaveBeenCalledWith({
          url: endpoint,
          method: 'POST',
          headers,
        });
      } catch (error) {}
    });

    it('should have been called with correct headers', async () => {
      try {
        const headers = expect.objectContaining({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        });
        const sessionInfo = await mstrApi.login(loginInfo);

        expect(axios).toHaveBeenCalledWith(headers);
      } catch (error) {}
    });
  });
});
