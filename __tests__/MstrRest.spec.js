const mstr = require('../lib/mstr');
const axios = require('axios');
const { TestScheduler } = require('jest');

jest.mock('axios');

describe('MSTR REST', () => {
  describe('Authentication', () => {
    test('axios shouls have been called', async () => {
      const testUrl = 'http://localhost:8080/112U2Library/api';
      const mstrApi = new mstr.REST({
        baseUrl: testUrl,
      });

      const loginInfo = {
        username: 'Administrator',
        password: '',
        loginMode: 1,
      };

      axios.post.mockImplementation(() => {
        Promise.resolve({ data: {} });
      });

      try {
        const sessionInfo = await mstrApi.login(loginInfo);
      } catch (error) {}

      const endpoint = '/api/auth/login';
      const method = 'POST';
      expect(axios).toHaveBeenCalledWith({
        method,
        data: loginInfo,
      });
    });
  });
});
